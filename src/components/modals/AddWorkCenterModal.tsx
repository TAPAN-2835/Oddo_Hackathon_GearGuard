import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { createWorkCenter } from '@/services/workcenters.service';

interface AddWorkCenterModalProps {
    open: boolean;
    onClose: () => void;
}

export function AddWorkCenterModal({ open, onClose }: AddWorkCenterModalProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        location: '',
        description: '',
        capacity: '',
        status: 'Active',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await createWorkCenter({
                name: formData.name,
                location: formData.location || null,
                description: formData.description || null,
                capacity: parseInt(formData.capacity) || 1,
                status: formData.status as 'Active' | 'Inactive',
            });

            toast({
                title: 'Success',
                description: 'Work center created successfully',
            });

            // Reset form
            setFormData({
                name: '',
                location: '',
                description: '',
                capacity: '',
                status: 'Active',
            });

            onClose();
        } catch (error: any) {
            console.error('Error creating work center:', error);
            toast({
                title: 'Error',
                description: error.message || 'Failed to create work center',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Add Work Center</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Name *</Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="e.g., Assembly Line 1"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input
                            id="location"
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            placeholder="e.g., Building A, Floor 2"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Brief description of the work center"
                            rows={3}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="capacity">Capacity *</Label>
                        <Input
                            id="capacity"
                            type="number"
                            min="1"
                            value={formData.capacity}
                            onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                            placeholder="e.g., 10"
                            required
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Creating...' : 'Create Work Center'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
