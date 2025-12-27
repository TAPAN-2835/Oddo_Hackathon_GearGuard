import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getAllEquipment } from '@/services/equipment.service';
import { createRequest } from '@/services/requests.service';
import { getAllTeams } from '@/services/teams.service';
import { toast } from '@/hooks/use-toast';

interface CreateRequestModalProps {
  open: boolean;
  onClose: () => void;
}

export function CreateRequestModal({ open, onClose }: CreateRequestModalProps) {
  const [selectedEquipment, setSelectedEquipment] = useState('');
  const [subject, setSubject] = useState('');
  const [type, setType] = useState<'Preventive' | 'Corrective'>('Preventive');
  const [scheduledDate, setScheduledDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [equipment, setEquipment] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);

  useEffect(() => {
    if (open) {
      fetchData();
    }
  }, [open]);

  const fetchData = async () => {
    try {
      const [equipmentData, teamsData] = await Promise.all([
        getAllEquipment(),
        getAllTeams(),
      ]);
      setEquipment(equipmentData || []);
      setTeams(teamsData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const selectedEquipmentData = equipment.find(eq => eq.id === selectedEquipment);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createRequest({
        subject,
        equipment_id: selectedEquipment,
        team_id: selectedEquipmentData?.team_id || null,
        type,
        scheduled_date: scheduledDate,
        status: 'New',
        priority: 'Medium',
      });

      toast({
        title: 'Request Created',
        description: `Maintenance request "${subject}" has been created successfully.`,
      });

      onClose();
      // Reset form
      setSelectedEquipment('');
      setSubject('');
      setType('Preventive');
      setScheduledDate('');
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
      <DialogContent className="sm:max-w-[500px] bg-card">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Create Maintenance Request
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Brief description of the issue"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="equipment">Equipment</Label>
            <Select value={selectedEquipment} onValueChange={setSelectedEquipment}>
              <SelectTrigger>
                <SelectValue placeholder="Select equipment" />
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

          {selectedEquipmentData && (
            <div className="p-3 bg-secondary rounded-lg">
              <p className="text-sm text-muted-foreground">
                Assigned Team: <span className="font-medium text-foreground">{selectedEquipmentData.team}</span>
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Request Type</Label>
              <Select value={type} onValueChange={(v) => setType(v as 'Preventive' | 'Corrective')}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  <SelectItem value="Preventive">Preventive</SelectItem>
                  <SelectItem value="Corrective">Corrective</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Scheduled Date</Label>
              <Input
                id="date"
                type="date"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="flex-1 bg-primary hover:bg-primary/90">
              {loading ? 'Creating...' : 'Create Request'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
