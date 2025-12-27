import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { createTeam } from '@/services/teams.service';

interface CreateTeamModalProps {
    open: boolean;
    onClose: () => void;
}

export function CreateTeamModal({ open, onClose }: CreateTeamModalProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        color: '#6366f1',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await createTeam({
                name: formData.name,
                description: formData.description || null,
                color: formData.color,
            });

            toast({
                title: 'Success',
                description: 'Team created successfully',
            });

            // Reset form
            setFormData({
                name: '',
                description: '',
                color: '#6366f1',
            });

            onClose();
        } catch (error: any) {
            console.error('Error creating team:', error);
            toast({
                title: 'Error',
                description: error.message || 'Failed to create team',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    const colorOptions = [
        { name: 'Indigo', value: '#6366f1' },
        { name: 'Blue', value: '#3b82f6' },
        { name: 'Green', value: '#10b981' },
        { name: 'Yellow', value: '#f59e0b' },
        { name: 'Red', value: '#ef4444' },
        { name: 'Purple', value: '#a855f7' },
        { name: 'Pink', value: '#ec4899' },
        { name: 'Teal', value: '#14b8a6' },
    ];

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Create Team</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Team Name *</Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="e.g., Mechanical Team"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Brief description of the team"
                            rows={3}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="color">Team Color *</Label>
                        <div className="grid grid-cols-4 gap-2">
                            {colorOptions.map((color) => (
                                <button
                                    key={color.value}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, color: color.value })}
                                    className={`h-10 rounded-lg border-2 transition-all ${formData.color === color.value
                                            ? 'border-foreground scale-110'
                                            : 'border-border hover:scale-105'
                                        }`}
                                    style={{ backgroundColor: color.value }}
                                    title={color.name}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Creating...' : 'Create Team'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
