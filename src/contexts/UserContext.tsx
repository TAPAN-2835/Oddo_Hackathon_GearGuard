import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getCurrentUser, getUserProfile } from '@/services/auth.service';
import { supabase } from '@/lib/supabase';

interface UserProfile {
    id: string;
    email: string;
    full_name: string;
    role: string;
    department: string | null;
    avatar_url: string | null;
    created_at: string;
    updated_at: string;
}

interface UserContextType {
    user: any | null;
    profile: UserProfile | null;
    loading: boolean;
    refreshProfile: () => Promise<void>;
    updateAvatar: (avatarUrl: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<any | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchUserData = async () => {
        try {
            setLoading(true);
            const currentUser = await getCurrentUser();
            if (currentUser) {
                setUser(currentUser);
                const userProfile = await getUserProfile(currentUser.id);
                setProfile(userProfile);
            } else {
                setUser(null);
                setProfile(null);
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
            setUser(null);
            setProfile(null);
        } finally {
            setLoading(false);
        }
    };

    const refreshProfile = async () => {
        if (!user) return;
        try {
            const userProfile = await getUserProfile(user.id);
            setProfile(userProfile);
        } catch (error) {
            console.error('Error refreshing profile:', error);
        }
    };

    const updateAvatar = (avatarUrl: string) => {
        if (profile) {
            setProfile({ ...profile, avatar_url: avatarUrl });
        }
    };

    useEffect(() => {
        // Initial fetch
        fetchUserData();

        // Listen for auth state changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            console.log('Auth state changed:', event, session?.user?.id);

            if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
                // User logged in or token refreshed, fetch user data
                await fetchUserData();
            } else if (event === 'SIGNED_OUT') {
                // User logged out, clear data
                setUser(null);
                setProfile(null);
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    return (
        <UserContext.Provider value={{ user, profile, loading, refreshProfile, updateAvatar }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
}
