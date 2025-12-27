import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { createEquipment, getEquipmentCategories } from '@/services/equipment.service';
import { supabase } from '@/lib/supabase';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface AddEquipmentModalProps {
    open: boolean;
    onClose: () => void;
}

const DEPARTMENTS = [
    'Production',
    'Maintenance',
    'Quality Control',
    'Warehouse',
    'IT',
    'Administration',
    'Engineering',
];

export function AddEquipmentModal({ open, onClose }: AddEquipmentModalProps) {
    const [formData, setFormData] = useState({
        name: '',
        serial_number: '',
        category_id: '',
        location: '',
        status: 'Active',
        notes: '',
        department: '',
        assigned_to: '',
        warranty_provider: '',
        maintenance_team_id: '',
        default_technician_id: '',
    });
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState<any[]>([]);
    const [teams, setTeams] = useState<any[]>([]);
    const [technicians, setTechnicians] = useState<any[]>([]);
    const [users, setUsers] = useState<any[]>([]);
    const [purchaseDate, setPurchaseDate] = useState<Date | undefined>();
    const [warrantyDate, setWarrantyDate] = useState<Date | undefined>();

    useEffect(() => {
        if (open) {
            fetchCategories();
            fetchTeams();
            fetchTechnicians();
            fetchUsers();
        }
    }, [open]);

    const fetchCategories = async () => {
        try {
            const data = await getEquipmentCategories();
            setCategories(data || []);
        } catch (error) {
            console.error('Error fetching categories:', error);
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

    const fetchTechnicians = async () => {
        try {
            const { data, error } = await supabase
                .from('technicians')
                .select('*, profiles(full_name)')
                .order('created_at');
            if (error) throw error;
            setTechnicians(data || []);
        } catch (error) {
            console.error('Error fetching technicians:', error);
        }
    };

    const fetchUsers = async () => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('id, full_name, email')
                .order('full_name');
            if (error) throw error;
            setUsers(data || []);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await createEquipment({
                name: formData.name,
                category_id: formData.category_id || null,
                serial_number: formData.serial_number,
                location: formData.location || 'Main Facility',
                status: formData.status as 'Active' | 'Inactive' | 'Under Maintenance' | 'Scrap',
                notes: formData.notes || null,
                department: formData.department || null,
                assigned_to: formData.assigned_to || null,
                purchase_date: purchaseDate ? format(purchaseDate, 'yyyy-MM-dd') : null,
                warranty_expiry_date: warrantyDate ? format(warrantyDate, 'yyyy-MM-dd') : null,
                warranty_provider: formData.warranty_provider || null,
                maintenance_team_id: formData.maintenance_team_id || null,
                default_technician_id: formData.default_technician_id || null,
            });

            toast({
                title: 'Equipment Added',
                description: `${formData.name} has been added successfully.`,
            });

            onClose();
            // Reset form
            setFormData({
                name: '',
                serial_number: '',
                category_id: '',
                location: '',
                status: 'Active',
                notes: '',
                department: '',
                assigned_to: '',
                warranty_provider: '',
                maintenance_team_id: '',
                default_technician_id: '',
            });
            setPurchaseDate(undefined);
            setWarrantyDate(undefined);
        } catch (error: any) {
            console.error('Error adding equipment:', error);
            toast({
                title: 'Error',
                description: error.message || 'Failed to add equipment.',
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
                    <DialogTitle>Add New Equipment</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Basic Information */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold">Basic Information</h3>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Equipment Name *</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="serial_number">Serial Number *</Label>
                                <Input
                                    id="serial_number"
                                    value={formData.serial_number}
                                    onChange={(e) => setFormData({ ...formData, serial_number: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="category">Category</Label>
                                <Select
                                    value={formData.category_id}
                                    onValueChange={(value) => setFormData({ ...formData, category_id: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((cat) => (
                                            <SelectItem key={cat.id} value={cat.id}>
                                                {cat.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="status">Status</Label>
                                <Select
                                    value={formData.status}
                                    onValueChange={(value) => setFormData({ ...formData, status: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Active">Active</SelectItem>
                                        <SelectItem value="Inactive">Inactive</SelectItem>
                                        <SelectItem value="Under Maintenance">Under Maintenance</SelectItem>
                                        <SelectItem value="Scrap">Scrap</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
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
                    </div>

                    {/* Ownership & Assignment */}
                    <div className="space-y-4 border-t pt-4">
                        <h3 className="text-sm font-semibold">Ownership & Assignment</h3>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="department">Department</Label>
                                <Select
                                    value={formData.department}
                                    onValueChange={(value) => setFormData({ ...formData, department: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select department" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {DEPARTMENTS.map((dept) => (
                                            <SelectItem key={dept} value={dept}>
                                                {dept}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="assigned_to">Assigned To (Owner)</Label>
                                <Select
                                    value={formData.assigned_to}
                                    onValueChange={(value) => setFormData({ ...formData, assigned_to: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select employee" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {users.map((user) => (
                                            <SelectItem key={user.id} value={user.id}>
                                                {user.full_name || user.email}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="maintenance_team">Maintenance Team</Label>
                                <Select
                                    value={formData.maintenance_team_id}
                                    onValueChange={(value) => setFormData({ ...formData, maintenance_team_id: value })}
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

                            <div className="space-y-2">
                                <Label htmlFor="default_technician">Default Technician</Label>
                                <Select
                                    value={formData.default_technician_id}
                                    onValueChange={(value) => setFormData({ ...formData, default_technician_id: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select technician" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {technicians.map((tech) => (
                                            <SelectItem key={tech.id} value={tech.id}>
                                                {tech.profiles?.full_name || 'Unknown'}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    {/* Purchase & Warranty */}
                    <div className="space-y-4 border-t pt-4">
                        <h3 className="text-sm font-semibold">Purchase & Warranty Information</h3>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Purchase Date</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className={cn(
                                                "w-full justify-start text-left font-normal",
                                                !purchaseDate && "text-muted-foreground"
                                            )}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {purchaseDate ? format(purchaseDate, "PPP") : "Pick a date"}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar
                                            mode="single"
                                            selected={purchaseDate}
                                            onSelect={setPurchaseDate}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>

                            <div className="space-y-2">
                                <Label>Warranty Expiry Date</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className={cn(
                                                "w-full justify-start text-left font-normal",
                                                !warrantyDate && "text-muted-foreground"
                                            )}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {warrantyDate ? format(warrantyDate, "PPP") : "Pick a date"}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar
                                            mode="single"
                                            selected={warrantyDate}
                                            onSelect={setWarrantyDate}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="warranty_provider">Warranty Provider</Label>
                            <Input
                                id="warranty_provider"
                                value={formData.warranty_provider}
                                onChange={(e) => setFormData({ ...formData, warranty_provider: e.target.value })}
                                placeholder="e.g., ABC Warranty Services"
                            />
                        </div>
                    </div>

                    {/* Notes */}
                    <div className="space-y-2 border-t pt-4">
                        <Label htmlFor="notes">Notes</Label>
                        <Textarea
                            id="notes"
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            placeholder="Additional information..."
                            rows={3}
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Adding...' : 'Add Equipment'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
