import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/database.types';

type MaintenanceRequest = Database['public']['Tables']['maintenance_requests']['Row'];
type RequestInsert = Database['public']['Tables']['maintenance_requests']['Insert'];
type RequestUpdate = Database['public']['Tables']['maintenance_requests']['Update'];

// Get all maintenance requests with related data
export const getAllRequests = async () => {
    const { data, error } = await supabase
        .from('maintenance_requests')
        .select(`
      *,
      equipment:equipment(name, serial_number),
      team:teams!assigned_team_id(name, color),
      technician:technicians(id, user_id, profiles(full_name, avatar_url)),
      work_center:work_centers(name, location)
    `)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
};

// Get request by ID
export const getRequestById = async (id: string) => {
    const { data, error } = await supabase
        .from('maintenance_requests')
        .select(`
      *,
      equipment:equipment(name, serial_number),
      team:teams!assigned_team_id(name, color),
      technician:technicians(id, user_id, profiles(full_name)),
      work_center:work_centers(name, location)
    `)
        .eq('id', id)
        .single();

    if (error) throw error;
    return data;
};

// Create new maintenance request
export const createRequest = async (request: RequestInsert) => {
    const { data: { user } } = await supabase.auth.getUser();

    const { data, error } = await supabase
        .from('maintenance_requests')
        .insert({
            ...request,
            created_by: user?.id,
        })
        .select()
        .single();

    if (error) throw error;
    return data;
};

// Update maintenance request
export const updateRequest = async (id: string, updates: RequestUpdate) => {
    const { data, error } = await supabase
        .from('maintenance_requests')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return data;
};

// Delete maintenance request
export const deleteRequest = async (id: string) => {
    const { error } = await supabase
        .from('maintenance_requests')
        .delete()
        .eq('id', id);

    if (error) throw error;
};

// Get requests by status
export const getRequestsByStatus = async (status: MaintenanceRequest['status']) => {
    const { data, error } = await supabase
        .from('maintenance_requests')
        .select(`
      *,
      equipment:equipment(name, serial_number),
      team:teams(name, color)
    `)
        .eq('status', status)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
};

// Get requests by team
export const getRequestsByTeam = async (teamId: string) => {
    const { data, error } = await supabase
        .from('maintenance_requests')
        .select(`
      *,
      equipment:equipment(name, serial_number),
      team:teams(name, color)
    `)
        .eq('team_id', teamId)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
};

// Get requests by equipment (for smart button)
export const getRequestsByEquipment = async (equipmentId: string) => {
    const { data, error } = await supabase
        .from('maintenance_requests')
        .select(`
            *,
            equipment:equipment(name, serial_number),
            team:teams(name, color),
            technician:technicians(id, user_id, profiles(full_name))
        `)
        .eq('equipment_id', equipmentId)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
};

// Get requests assigned to technician
export const getRequestsByTechnician = async (technicianId: string) => {
    const { data, error } = await supabase
        .from('maintenance_requests')
        .select(`
      *,
      equipment:equipment(name, serial_number),
      team:teams(name, color)
    `)
        .eq('assigned_technician_id', technicianId)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
};

// Get analytics data for reports
// Get analytics data for reports
export const getRequestAnalytics = async () => {
    // Fetch all requests to aggregate on the client side
    // Note: For larger datasets, this should be done with database functions (RPC)
    const { data: requests, error } = await supabase
        .from('maintenance_requests')
        .select(`
            id,
            status,
            type,
            created_at,
            completed_at,
            actual_hours,
            team:teams!assigned_team_id(name)
        `);

    if (error) throw error;

    const totalRequests = requests?.length || 0;
    const completed = requests?.filter(r => r.status === 'Repaired').length || 0;
    const inProgress = requests?.filter(r => r.status === 'In Progress').length || 0;

    // Calculate average time (using actual_hours if available)
    const completedRequests = requests?.filter(r => r.status === 'Repaired' && r.actual_hours) || [];
    const avgTime = completedRequests.length > 0
        ? (completedRequests.reduce((acc, curr) => acc + (curr.actual_hours || 0), 0) / completedRequests.length).toFixed(1)
        : 0;

    // Aggregate by Team
    const teamCounts: Record<string, number> = {};
    requests?.forEach(r => {
        const teamName = r.team?.name || 'Unassigned';
        teamCounts[teamName] = (teamCounts[teamName] || 0) + 1;
    });
    const byTeam = Object.entries(teamCounts).map(([team, count]) => ({ team, count }));

    // Aggregate by Status
    const statusCounts: Record<string, number> = {};
    requests?.forEach(r => {
        statusCounts[r.status] = (statusCounts[r.status] || 0) + 1;
    });
    const byStatus = Object.entries(statusCounts).map(([status, count]) => ({ status, count }));

    // Aggregate by Type
    const typeCounts: Record<string, number> = {};
    requests?.forEach(r => {
        if (r.type) {
            typeCounts[r.type] = (typeCounts[r.type] || 0) + 1;
        }
    });
    const byType = Object.entries(typeCounts).map(([type, count]) => ({ type, count }));

    // Aggregate Over Time (by month)
    const monthCounts: Record<string, number> = {};
    requests?.forEach(r => {
        const date = new Date(r.created_at);
        const monthYear = date.toLocaleString('default', { month: 'short' });
        monthCounts[monthYear] = (monthCounts[monthYear] || 0) + 1;
    });
    const overTime = Object.entries(monthCounts).map(([month, count]) => ({ month, count }));

    return {
        totalRequests,
        completed,
        inProgress,
        avgTime,
        byTeam,
        byStatus,
        byType,
        overTime,
    };
};

// Subscribe to maintenance requests changes
export const subscribeToRequests = (callback: () => void) => {
    return supabase
        .channel('maintenance_requests_changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'maintenance_requests' }, callback)
        .subscribe();
};

// Create maintenance request (new function for modal)
export const createMaintenanceRequest = async (requestData: {
    subject: string;
    description?: string | null;
    equipment_id?: string | null;
    team_id?: string | null;
    type: 'Preventive' | 'Corrective' | 'Emergency';
    priority: 'Low' | 'Medium' | 'High' | 'Critical';
    status: string;
    scheduled_date?: string | null;
    estimated_hours?: number | null;
}) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Generate request number
    const requestNumber = `REQ-${Date.now()}`;

    const { data, error } = await supabase
        .from('maintenance_requests')
        .insert([{
            request_number: requestNumber,
            subject: requestData.subject,
            description: requestData.description,
            equipment_id: requestData.equipment_id,
            team_id: requestData.team_id,
            type: requestData.type,
            priority: requestData.priority,
            status: requestData.status,
            scheduled_date: requestData.scheduled_date,
            estimated_hours: requestData.estimated_hours,
            created_by: user.id,
        }])
        .select()
        .single();

    if (error) throw error;
    return data;
};

// Assign request to current user (self-assignment)
export const assignRequestToMe = async (requestId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Get or create technician record for user
    const { data: technician, error: techError } = await supabase
        .from('technicians')
        .select('id')
        .eq('user_id', user.id)
        .single();

    if (techError && techError.code !== 'PGRST116') throw techError;

    let technicianId = technician?.id;

    // If no technician record exists, create one
    if (!technicianId) {
        const { data: newTech, error: createError } = await supabase
            .from('technicians')
            .insert([{ user_id: user.id, status: 'Available' }])
            .select('id')
            .single();

        if (createError) throw createError;
        technicianId = newTech.id;
    }

    // Update request with assignment and change status to In Progress
    const { data, error } = await supabase
        .from('maintenance_requests')
        .update({
            assigned_technician_id: technicianId,
            status: 'In Progress',
            started_at: new Date().toISOString(),
        })
        .eq('id', requestId)
        .select()
        .single();

    if (error) throw error;
    return data;
};

// Complete request with duration
export const completeRequestWithDuration = async (
    requestId: string,
    actualHours: number,
    notes?: string
) => {
    const { data, error } = await supabase
        .from('maintenance_requests')
        .update({
            status: 'Repaired',
            actual_hours: actualHours,
            completed_at: new Date().toISOString(),
            description: notes ? notes : undefined,
        })
        .eq('id', requestId)
        .select()
        .single();

    if (error) throw error;
    return data;
};

// Get scheduled requests for calendar
export const getScheduledRequests = async (startDate?: Date, endDate?: Date) => {
    let query = supabase
        .from('maintenance_requests')
        .select(`
            *,
            equipment:equipment(name, serial_number),
            team:teams(name, color),
            technician:technicians(id, user_id, profiles(full_name))
        `)
        .not('scheduled_date', 'is', null)
        .order('scheduled_date', { ascending: true });

    if (startDate) {
        query = query.gte('scheduled_date', startDate.toISOString());
    }
    if (endDate) {
        query = query.lte('scheduled_date', endDate.toISOString());
    }

    const { data, error } = await query;

    if (error) throw error;
    return data;
};

