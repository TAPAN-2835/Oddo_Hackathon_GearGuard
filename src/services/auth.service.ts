import { supabase } from '@/lib/supabase';

// Sign up new user
export const signUp = async (email: string, password: string, fullName: string) => {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: fullName,
            },
        },
    });

    if (error) throw error;

    // Create profile
    if (data.user) {
        const { error: profileError } = await supabase
            .from('profiles')
            .insert({
                id: data.user.id,
                email: email,
                full_name: fullName,
                role: 'technician', // Default role
            });

        if (profileError) throw profileError;
    }

    return data;
};

// Sign in user
export const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) throw error;
    return data;
};

// Sign out user
export const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
};

// Get current session
export const getSession = async () => {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
};

// Get current user
export const getCurrentUser = async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
};

// Update user profile
export const updateProfile = async (userId: string, updates: {
    full_name?: string;
    department?: string;
    avatar_url?: string;
}) => {
    const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

    if (error) throw error;
    return data;
};

// Get user profile
export const getUserProfile = async (userId: string) => {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

    if (error) throw error;
    return data;
};

// Upload avatar to Supabase Storage
export const uploadAvatar = async (userId: string, file: Blob): Promise<string> => {
    const fileExt = 'jpg'; // We compress to JPEG
    const fileName = `${Date.now()}.${fileExt}`;
    // Path must be: userId/filename for RLS policies to work
    const filePath = `${userId}/${fileName}`;

    const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
            cacheControl: '3600',
            upsert: true,
        });

    if (uploadError) throw uploadError;

    // Get public URL
    const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

    return data.publicUrl;
};

// Update avatar URL in profile
export const updateAvatarUrl = async (userId: string, avatarUrl: string) => {
    return updateProfile(userId, { avatar_url: avatarUrl });
};

// Delete old avatar from storage
export const deleteAvatar = async (avatarUrl: string) => {
    try {
        // Extract file path from URL
        const url = new URL(avatarUrl);
        const pathParts = url.pathname.split('/');
        const filePath = pathParts.slice(pathParts.indexOf('avatars')).join('/');

        const { error } = await supabase.storage
            .from('avatars')
            .remove([filePath]);

        if (error) console.error('Error deleting avatar:', error);
    } catch (error) {
        console.error('Error parsing avatar URL:', error);
    }
};

// Check if user is authenticated
export const isAuthenticated = async () => {
    const session = await getSession();
    return !!session;
};
