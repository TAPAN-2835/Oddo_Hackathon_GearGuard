import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/database.types';

type WorkCenter = Database['public']['Tables']['work_centers']['Row'];
type WorkCenterInsert = Database['public']['Tables']['work_centers']['Insert'];
type WorkCenterUpdate = Database['public']['Tables']['work_centers']['Update'];

// Get all work centers
export const getAllWorkCenters = async () => {
    const { data, error } = await supabase
        .from('work_centers')
        .select('*')
        .order('name');

    if (error) throw error;
    return data;
};

// Get work center by ID
export const getWorkCenterById = async (id: string) => {
    const { data, error } = await supabase
        .from('work_centers')
        .select('*')
        .eq('id', id)
        .single();

    if (error) throw error;
    return data;
};

// Create new work center
export const createWorkCenter = async (workCenter: WorkCenterInsert) => {
    const { data, error } = await supabase
        .from('work_centers')
        .insert(workCenter)
        .select()
        .single();

    if (error) throw error;
    return data;
};

// Update work center
export const updateWorkCenter = async (id: string, updates: WorkCenterUpdate) => {
    const { data, error } = await supabase
        .from('work_centers')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return data;
};

// Delete work center
export const deleteWorkCenter = async (id: string) => {
    const { error } = await supabase
        .from('work_centers')
        .delete()
        .eq('id', id);

    if (error) throw error;
};

// Get active work centers
export const getActiveWorkCenters = async () => {
    const { data, error } = await supabase
        .from('work_centers')
        .select('*')
        .eq('status', 'Active')
        .order('name');

    if (error) throw error;
    return data;
};
