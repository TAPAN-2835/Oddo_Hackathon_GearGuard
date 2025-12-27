export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string
                    email: string
                    full_name: string | null
                    role: 'admin' | 'technician' | 'manager'
                    department: string | null
                    avatar_url: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id: string
                    email: string
                    full_name?: string | null
                    role?: 'admin' | 'technician' | 'manager'
                    department?: string | null
                    avatar_url?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    email?: string
                    full_name?: string | null
                    role?: 'admin' | 'technician' | 'manager'
                    department?: string | null
                    avatar_url?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            teams: {
                Row: {
                    id: string
                    name: string
                    description: string | null
                    color: string
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    description?: string | null
                    color?: string
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    description?: string | null
                    color?: string
                    created_at?: string
                    updated_at?: string
                }
            }
            equipment_categories: {
                Row: {
                    id: string
                    name: string
                    description: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    description?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    description?: string | null
                    created_at?: string
                }
            }
            equipment: {
                Row: {
                    id: string
                    name: string
                    serial_number: string
                    category_id: string | null
                    team_id: string | null
                    status: 'Active' | 'Inactive' | 'Under Maintenance' | 'Scrap'
                    location: string | null
                    purchase_date: string | null
                    last_maintenance_date: string | null
                    next_maintenance_date: string | null
                    notes: string | null
                    created_by: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    serial_number: string
                    category_id?: string | null
                    team_id?: string | null
                    status?: 'Active' | 'Inactive' | 'Under Maintenance' | 'Scrap'
                    location?: string | null
                    purchase_date?: string | null
                    last_maintenance_date?: string | null
                    next_maintenance_date?: string | null
                    notes?: string | null
                    created_by?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    serial_number?: string
                    category_id?: string | null
                    team_id?: string | null
                    status?: 'Active' | 'Inactive' | 'Under Maintenance' | 'Scrap'
                    location?: string | null
                    purchase_date?: string | null
                    last_maintenance_date?: string | null
                    next_maintenance_date?: string | null
                    notes?: string | null
                    created_by?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            work_centers: {
                Row: {
                    id: string
                    name: string
                    location: string | null
                    description: string | null
                    capacity: number
                    status: 'Active' | 'Inactive'
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    location?: string | null
                    description?: string | null
                    capacity?: number
                    status?: 'Active' | 'Inactive'
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    location?: string | null
                    description?: string | null
                    capacity?: number
                    status?: 'Active' | 'Inactive'
                    created_at?: string
                    updated_at?: string
                }
            }
            technicians: {
                Row: {
                    id: string
                    user_id: string | null
                    team_id: string | null
                    specialization: string | null
                    status: 'Available' | 'Busy' | 'Off Duty'
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id?: string | null
                    team_id?: string | null
                    specialization?: string | null
                    status?: 'Available' | 'Busy' | 'Off Duty'
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string | null
                    team_id?: string | null
                    specialization?: string | null
                    status?: 'Available' | 'Busy' | 'Off Duty'
                    created_at?: string
                    updated_at?: string
                }
            }
            maintenance_requests: {
                Row: {
                    id: string
                    request_number: string
                    subject: string
                    description: string | null
                    equipment_id: string | null
                    team_id: string | null
                    assigned_technician_id: string | null
                    work_center_id: string | null
                    type: 'Preventive' | 'Corrective' | 'Emergency'
                    status: 'New' | 'In Progress' | 'Repaired' | 'Scrap' | 'Cancelled'
                    priority: 'Low' | 'Medium' | 'High' | 'Critical'
                    scheduled_date: string | null
                    started_at: string | null
                    completed_at: string | null
                    estimated_hours: number | null
                    actual_hours: number | null
                    cost: number | null
                    created_by: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    request_number?: string
                    subject: string
                    description?: string | null
                    equipment_id?: string | null
                    team_id?: string | null
                    assigned_technician_id?: string | null
                    work_center_id?: string | null
                    type?: 'Preventive' | 'Corrective' | 'Emergency'
                    status?: 'New' | 'In Progress' | 'Repaired' | 'Scrap' | 'Cancelled'
                    priority?: 'Low' | 'Medium' | 'High' | 'Critical'
                    scheduled_date?: string | null
                    started_at?: string | null
                    completed_at?: string | null
                    estimated_hours?: number | null
                    actual_hours?: number | null
                    cost?: number | null
                    created_by?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    request_number?: string
                    subject?: string
                    description?: string | null
                    equipment_id?: string | null
                    team_id?: string | null
                    assigned_technician_id?: string | null
                    work_center_id?: string | null
                    type?: 'Preventive' | 'Corrective' | 'Emergency'
                    status?: 'New' | 'In Progress' | 'Repaired' | 'Scrap' | 'Cancelled'
                    priority?: 'Low' | 'Medium' | 'High' | 'Critical'
                    scheduled_date?: string | null
                    started_at?: string | null
                    completed_at?: string | null
                    estimated_hours?: number | null
                    actual_hours?: number | null
                    cost?: number | null
                    created_by?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            notifications: {
                Row: {
                    id: string
                    user_id: string
                    title: string
                    message: string
                    type: 'success' | 'warning' | 'info' | 'error'
                    read: boolean
                    link: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    title: string
                    message: string
                    type?: 'success' | 'warning' | 'info' | 'error'
                    read?: boolean
                    link?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    title?: string
                    message?: string
                    type?: 'success' | 'warning' | 'info' | 'error'
                    read?: boolean
                    link?: string | null
                    created_at?: string
                }
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            generate_request_number: {
                Args: Record<PropertyKey, never>
                Returns: string
            }
            create_notification: {
                Args: {
                    p_user_id: string
                    p_title: string
                    p_message: string
                    p_type?: 'success' | 'warning' | 'info' | 'error'
                    p_link?: string | null
                }
                Returns: string
            }
        }
        Enums: {
            [_ in never]: never
        }
    }
}
