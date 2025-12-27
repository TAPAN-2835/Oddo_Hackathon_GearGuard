import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/database.types';
import { getCurrentUser } from '@/services/auth.service';

type Equipment = Database['public']['Tables']['equipment']['Row'];
type EquipmentInsert = Database['public']['Tables']['equipment']['Insert'];
type EquipmentUpdate = Database['public']['Tables']['equipment']['Update'];

// Get all equipment with related data
export const getAllEquipment = async () => {
    const { data, error } = await supabase
        .from('equipment')
        .select(`
            *,
            category:equipment_categories(id, name),
            team:teams!maintenance_team_id(id, name)
        `)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Equipment fetch error:', error);
        throw error;
    }
    return data;
};

// Get equipment by ID
export const getEquipmentById = async (id: string) => {
    const { data, error } = await supabase
        .from('equipment')
        .select(`
      *,
      category:equipment_categories(name),
      team:teams!maintenance_team_id(name, color)
    `)
        .eq('id', id)
        .single();

    if (error) throw error;
    return data;
};

// Create new equipment
export const createEquipment = async (equipmentData: {
    name: string;
    serial_number: string;
    category_id?: string | null;
    location?: string | null;
    status?: string;
    notes?: string | null;
    department?: string | null;
    assigned_to?: string | null;
    purchase_date?: string | null;
    warranty_expiry_date?: string | null;
    warranty_provider?: string | null;
    maintenance_team_id?: string | null;
    default_technician_id?: string | null;
}) => {
    const user = await getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
        .from('equipment')
        .insert([{
            ...equipmentData,
            created_by: user.id,
        }])
        .select()
        .single();

    if (error) throw error;
    return data;
};

// Update equipment
export const updateEquipment = async (id: string, updates: EquipmentUpdate) => {
    const { data, error } = await supabase
        .from('equipment')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return data;
};

// Delete equipment
export const deleteEquipment = async (id: string) => {
    const { error } = await supabase
        .from('equipment')
        .delete()
        .eq('id', id);

    if (error) throw error;
};

// Get equipment by team
export const getEquipmentByTeam = async (teamId: string) => {
    const { data, error } = await supabase
        .from('equipment')
        .select(`
      *,
      category:equipment_categories(name),
      team:teams(name, color)
    `)
        .eq('team_id', teamId);

    if (error) throw error;
    return data;
};

// Get equipment by status
export const getEquipmentByStatus = async (status: Equipment['status']) => {
    const { data, error } = await supabase
        .from('equipment')
        .select(`
      *,
      category:equipment_categories(name),
      team:teams(name, color)
    `)
        .eq('status', status);

    if (error) throw error;
    return data;
};

// Get equipment categories
export const getEquipmentCategories = async () => {
    const { data, error } = await supabase
        .from('equipment_categories')
        .select('*')
        .order('name');

    if (error) throw error;
    return data;
};

// Subscribe to equipment changes (real-time)
export const subscribeToEquipment = (callback: (payload: any) => void) => {
    return supabase
        .channel('equipment_changes')
        .on(
            'postgres_changes',
            {
                event: '*',
                schema: 'public',
                table: 'equipment',
            },
            callback
        )
        .subscribe();
};
