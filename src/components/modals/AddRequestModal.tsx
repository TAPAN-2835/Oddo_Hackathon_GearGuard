import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import { createMaintenanceRequest } from '@/services/requests.service';
import { getAllEquipment } from '@/services/equipment.service';
import { supabase } from '@/lib/supabase';

interface AddRequestModalProps {
    open: boolean;
    onClose: () => void;
}

export function AddRequestModal({ open, onClose }: AddRequestModalProps) {
    const [loading, setLoading] = useState(false);
    const [equipment, setEquipment] = useState<any[]>([]);
    const [teams, setTeams] = useState<any[]>([]);
    const [scheduledDate, setScheduledDate] = useState<Date | undefined>();
    const [formData, setFormData] = useState({
        subject: '',
        description: '',
        equipment_id: '',
        team_id: '',
        type: 'Corrective',
        priority: 'Medium',
        estimated_hours: '',
    });

    useEffect(() => {
        if (open) {
            fetchEquipment();
            fetchTeams();
        }
    }, [open]);

    const fetchEquipment = async () => {
        try {
            const data = await getAllEquipment();
            setEquipment(data || []);
        } catch (error) {
            console.error('Error fetching equipment:', error);
        }
    };

    const fetchTeams = async () => {
        try {
            const { data, error } = await supabase
                .from('teams')
                .select('*')
                .order('name');
            if (error) throw error;
            setTeams(data || []);
        } catch (error) {
            console.error('Error fetching teams:', error);
        }
    };

    // AUTO-FILL LOGIC: When equipment is selected, auto-fill team
    const handleEquipmentChange = (equipmentId: string) => {
        const selectedEquipment = equipment.find(eq => eq.id === equipmentId);

        setFormData({
            ...formData,
            equipment_id: equipmentId,
            // Auto-fill team from equipment
            team_id: selectedEquipment?.team_id || formData.team_id,
        });

        if (selectedEquipment?.team_id) {
            toast({
                title: 'Auto-filled',
                description: `Maintenance team set from equipment: ${selectedEquipment.team?.name || 'Team'}`,
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await createMaintenanceRequest({
                subject: formData.subject,
                description: formData.description,
                equipment_id: formData.equipment_id || null,
                team_id: formData.team_id || null,
                type: formData.type as 'Preventive' | 'Corrective' | 'Emergency',
                priority: formData.priority as 'Low' | 'Medium' | 'High' | 'Critical',
                status: 'New',
                scheduled_date: scheduledDate ? scheduledDate.toISOString() : null,
                estimated_hours: formData.estimated_hours ? parseFloat(formData.estimated_hours) : null,
            });

            toast({
                title: 'Request Created',
                description: `${formData.type} maintenance request has been created successfully.`,
            });

            onClose();
            // Reset form
            setFormData({
                subject: '',
                description: '',
                equipment_id: '',
                team_id: '',
                type: 'Corrective',
                priority: 'Medium',
                estimated_hours: '',
            });
            setScheduledDate(undefined);
        } catch (error: any) {
            console.error('Error creating request:', error);
            toast({
                title: 'Error',
                description: error.message || 'Failed to create request.',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Create Maintenance Request</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Request Type & Priority */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="type">Request Type *</Label>
                            <Select
                                value={formData.type}
                                onValueChange={(value) => setFormData({ ...formData, type: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Corrective">Corrective (Breakdown)</SelectItem>
                                    <SelectItem value="Preventive">Preventive (Routine)</SelectItem>
                                    <SelectItem value="Emergency">Emergency</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="priority">Priority *</Label>
                            <Select
                                value={formData.priority}
                                onValueChange={(value) => setFormData({ ...formData, priority: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Low">Low</SelectItem>
                                    <SelectItem value="Medium">Medium</SelectItem>
                                    <SelectItem value="High">High</SelectItem>
                                    <SelectItem value="Critical">Critical</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Subject */}
                    <div className="space-y-2">
                        <Label htmlFor="subject">Subject *</Label>
                        <Input
                            id="subject"
                            value={formData.subject}
                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                            placeholder="e.g., Leaking Oil, Routine Checkup"
                            required
                        />
                    </div>

                    {/* Equipment Selection with Auto-Fill */}
                    <div className="space-y-2">
                        <Label htmlFor="equipment">Equipment</Label>
                        <Select
                            value={formData.equipment_id}
                            onValueChange={handleEquipmentChange}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select equipment" />
                            </SelectTrigger>
                            <SelectContent>
                                {equipment.map((eq) => (
                                    <SelectItem key={eq.id} value={eq.id}>
                                        {eq.name} ({eq.serial_number})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground">
                            Team will be auto-filled from equipment
                        </p>
                    </div>

                    {/* Team */}
                    <div className="space-y-2">
                        <Label htmlFor="team">Maintenance Team</Label>
                        <Select
                            value={formData.team_id}
                            onValueChange={(value) => setFormData({ ...formData, team_id: value })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select team" />
                            </SelectTrigger>
                            <SelectContent>
                                {teams.map((team) => (
                                    <SelectItem key={team.id} value={team.id}>
                                        {team.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Scheduled Date & Estimated Hours */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Scheduled Date</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className={cn(
                                            "w-full justify-start text-left font-normal",
                                            !scheduledDate && "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {scheduledDate ? format(scheduledDate, "PPP") : "Pick a date"}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={scheduledDate}
                                        onSelect={setScheduledDate}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="estimated_hours">Estimated Hours</Label>
                            <Input
                                id="estimated_hours"
                                type="number"
                                step="0.5"
                                value={formData.estimated_hours}
                                onChange={(e) => setFormData({ ...formData, estimated_hours: e.target.value })}
                                placeholder="e.g., 2.5"
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Describe the issue or maintenance task..."
                            rows={4}
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Creating...' : 'Create Request'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
