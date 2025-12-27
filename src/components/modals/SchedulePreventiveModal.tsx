import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { equipment } from '@/data/mockData';
import { toast } from '@/hooks/use-toast';

interface SchedulePreventiveModalProps {
    open: boolean;
    onClose: () => void;
}

export function SchedulePreventiveModal({ open, onClose }: SchedulePreventiveModalProps) {
    const [formData, setFormData] = useState({
        equipment: '',
        date: '',
        time: '',
        technician: '',
        recurrence: 'Once',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const selectedEq = equipment.find(eq => eq.id === formData.equipment);
        toast({
            title: 'Preventive Maintenance Scheduled',
            description: `PM scheduled for ${selectedEq?.name} on ${formData.date} at ${formData.time}`,
        });
        onClose();
        setFormData({
            equipment: '',
            date: '',
            time: '',
            technician: '',
            recurrence: 'Once',
        });
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px] bg-card">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">Schedule Preventive Maintenance</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    <div className="space-y-2">
                        <Label htmlFor="equipment">Select Equipment</Label>
                        <Select value={formData.equipment} onValueChange={(v) => setFormData({ ...formData, equipment: v })}>
                            <SelectTrigger>
                                <SelectValue placeholder="Choose equipment" />
                            </SelectTrigger>
                            <SelectContent className="bg-popover">
                                {equipment.filter(eq => eq.status === 'Active').map((eq) => (
                                    <SelectItem key={eq.id} value={eq.id}>
                                        {eq.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="date">Date</Label>
                            <Input
                                id="date"
                                type="date"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="time">Time</Label>
                            <Input
                                id="time"
                                type="time"
                                value={formData.time}
                                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="technician">Assign Technician</Label>
                        <Select value={formData.technician} onValueChange={(v) => setFormData({ ...formData, technician: v })}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select technician" />
                            </SelectTrigger>
                            <SelectContent className="bg-popover">
                                <SelectItem value="mike">Mike Chen</SelectItem>
                                <SelectItem value="sarah">Sarah Miller</SelectItem>
                                <SelectItem value="john">John Davis</SelectItem>
                                <SelectItem value="emma">Emma Wilson</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="recurrence">Recurrence</Label>
                        <Select value={formData.recurrence} onValueChange={(v) => setFormData({ ...formData, recurrence: v })}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-popover">
                                <SelectItem value="Once">Once</SelectItem>
                                <SelectItem value="Daily">Daily</SelectItem>
                                <SelectItem value="Weekly">Weekly</SelectItem>
                                <SelectItem value="Monthly">Monthly</SelectItem>
                                <SelectItem value="Quarterly">Quarterly</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                            Cancel
                        </Button>
                        <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90">
                            Schedule Maintenance
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
