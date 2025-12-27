import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/database.types';

type Team = Database['public']['Tables']['teams']['Row'];
type TeamInsert = Database['public']['Tables']['teams']['Insert'];
type TeamUpdate = Database['public']['Tables']['teams']['Update'];

// Get all teams
export const getAllTeams = async () => {
    const { data, error } = await supabase
        .from('teams')
        .select('*')
        .order('name');

    if (error) throw error;
    return data;
};

// Get team by ID
export const getTeamById = async (id: string) => {
    const { data, error } = await supabase
        .from('teams')
        .select('*')
        .eq('id', id)
        .single();

    if (error) throw error;
    return data;
};

// Create new team
export const createTeam = async (team: TeamInsert) => {
    const { data, error } = await supabase
        .from('teams')
        .insert(team)
        .select()
        .single();

    if (error) throw error;
    return data;
};

// Update team
export const updateTeam = async (id: string, updates: TeamUpdate) => {
    const { data, error } = await supabase
        .from('teams')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return data;
};

// Delete team
export const deleteTeam = async (id: string) => {
    const { error } = await supabase
        .from('teams')
        .delete()
        .eq('id', id);

    if (error) throw error;
};

// Get technicians by team
export const getTechniciansByTeam = async (teamId: string) => {
    const { data, error } = await supabase
        .from('technicians')
        .select(`
      *,
      profile:profiles(full_name, email)
    `)
        .eq('team_id', teamId);

    if (error) throw error;
    return data;
};
