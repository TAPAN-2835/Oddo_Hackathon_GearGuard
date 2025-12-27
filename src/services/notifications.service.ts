import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/database.types';

type Notification = Database['public']['Tables']['notifications']['Row'];
type NotificationInsert = Database['public']['Tables']['notifications']['Insert'];

// Get user notifications
export const getUserNotifications = async (userId: string) => {
    const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50);

    if (error) throw error;
    return data;
};

// Get unread notifications count
export const getUnreadCount = async (userId: string) => {
    const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('read', false);

    if (error) throw error;
    return count || 0;
};

// Mark notification as read
export const markAsRead = async (notificationId: string) => {
    const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);

    if (error) throw error;
};

// Mark all notifications as read
export const markAllAsRead = async (userId: string) => {
    const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', userId)
        .eq('read', false);

    if (error) throw error;
};

// Create notification
export const createNotification = async (notification: NotificationInsert) => {
    const { data, error } = await supabase
        .from('notifications')
        .insert(notification)
        .select()
        .single();

    if (error) throw error;
    return data;
};

// Delete notification
export const deleteNotification = async (notificationId: string) => {
    const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);

    if (error) throw error;
};

// Subscribe to notifications (real-time)
export const subscribeToNotifications = (userId: string, callback: (payload: any) => void) => {
    return supabase
        .channel(`notifications_${userId}`)
        .on(
            'postgres_changes',
            {
                event: 'INSERT',
                schema: 'public',
                table: 'notifications',
                filter: `user_id=eq.${userId}`,
            },
            callback
        )
        .subscribe();
};
