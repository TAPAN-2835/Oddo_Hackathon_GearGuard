import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Mail, Briefcase, Building, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { updateProfile, signOut } from '@/services/auth.service';
import { AvatarUploadModal } from '@/components/profile/AvatarUploadModal';
import { getInitials, getAvatarUrl } from '@/utils/avatar.utils';
import { useUser } from '@/contexts/UserContext';

export default function Profile() {
    const navigate = useNavigate();
    const { profile, loading, refreshProfile } = useUser();
    const [saving, setSaving] = useState(false);
    const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        full_name: profile?.full_name || '',
        email: profile?.email || '',
        role: profile?.role || 'technician',
        department: profile?.department || '',
    });

    // Update form data when profile changes
    useState(() => {
        if (profile) {
            setFormData({
                full_name: profile.full_name || '',
                email: profile.email || '',
                role: profile.role || 'technician',
                department: profile.department || '',
            });
        }
    });

    const handleLogout = async () => {
        try {
            await signOut();
            sessionStorage.removeItem('hasSeenWelcome');
            navigate('/login');
        } catch (error) {
            console.error('Error logging out:', error);
            toast({
                title: 'Error',
                description: 'Failed to logout',
                variant: 'destructive',
            });
        }
    };

    const handleSave = async () => {
        if (!profile) return;

        setSaving(true);
        try {
            await updateProfile(profile.id, {
                full_name: formData.full_name,
                department: formData.department,
            });

            toast({
                title: 'Profile Updated',
                description: 'Your profile has been updated successfully.',
            });

            // Refresh profile data in context
            await refreshProfile();
        } catch (error: any) {
            console.error('Error updating profile:', error);
            toast({
                title: 'Error',
                description: 'Failed to update profile',
                variant: 'destructive',
            });
        } finally {
            setSaving(false);
        }
    };

    // Get initials from full name
    const getInitials = (name: string) => {
        if (!name) return '??';
        const parts = name.split(' ');
        if (parts.length >= 2) {
            return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    // Split full name for display
    const getFirstName = () => {
        const parts = formData.full_name.split(' ');
        return parts[0] || '';
    };

    const getLastName = () => {
        const parts = formData.full_name.split(' ');
        return parts.slice(1).join(' ') || '';
    };

    if (loading) {
        return (
            <MainLayout>
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className="max-w-4xl mx-auto space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Profile</h1>
                    <p className="text-muted-foreground mt-1">Manage your account information</p>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    {/* Profile Card */}
                    <Card className="p-6 md:col-span-1">
                        <div className="flex flex-col items-center text-center">
                            {profile?.avatar_url ? (
                                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-primary/20 mb-4">
                                    <img
                                        src={getAvatarUrl(profile.avatar_url, formData.full_name)}
                                        alt="Profile avatar"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            ) : (
                                <div className="w-24 h-24 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-primary-foreground text-3xl font-bold mb-4">
                                    {getInitials(formData.full_name)}
                                </div>
                            )}
                            <h2 className="text-xl font-semibold text-foreground">{formData.full_name || 'User'}</h2>
                            <p className="text-sm text-muted-foreground capitalize">{formData.role}</p>
                            <Button
                                variant="outline"
                                className="mt-4 w-full"
                                onClick={() => setIsAvatarModalOpen(true)}
                            >
                                Change Avatar
                            </Button>
                        </div>
                    </Card>

                    {/* Profile Details */}
                    <Card className="p-6 md:col-span-2">
                        <h3 className="text-lg font-semibold text-foreground mb-4">Personal Information</h3>

                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="firstName">First Name</Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <Input
                                            id="firstName"
                                            value={getFirstName()}
                                            onChange={(e) => {
                                                const lastName = getLastName();
                                                setFormData({ ...formData, full_name: `${e.target.value} ${lastName}`.trim() });
                                            }}
                                            className="pl-9"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lastName">Last Name</Label>
                                    <Input
                                        id="lastName"
                                        value={getLastName()}
                                        onChange={(e) => {
                                            const firstName = getFirstName();
                                            setFormData({ ...formData, full_name: `${firstName} ${e.target.value}`.trim() });
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        type="email"
                                        value={formData.email}
                                        className="pl-9"
                                        disabled
                                    />
                                </div>
                                <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="role">Role</Label>
                                <div className="relative">
                                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        id="role"
                                        value={formData.role}
                                        className="pl-9 capitalize"
                                        disabled
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="department">Department</Label>
                                <div className="relative">
                                    <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        id="department"
                                        value={formData.department}
                                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                        className="pl-9"
                                        placeholder="e.g., Operations, Maintenance"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <Button
                                    onClick={handleSave}
                                    className="flex-1"
                                    disabled={saving}
                                >
                                    {saving ? 'Saving...' : 'Save Changes'}
                                </Button>
                                <Button variant="outline" onClick={() => navigate(-1)} className="flex-1">
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Danger Zone */}
                <Card className="p-6 border-destructive/50">
                    <h3 className="text-lg font-semibold text-foreground mb-2">Danger Zone</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                        Once you logout, you'll need to sign in again to access your account.
                    </p>
                    <Button
                        variant="destructive"
                        onClick={handleLogout}
                        className="gap-2"
                    >
                        <LogOut className="w-4 h-4" />
                        Logout
                    </Button>
                </Card>

                {/* Avatar Upload Modal */}
                <AvatarUploadModal
                    open={isAvatarModalOpen}
                    onClose={() => setIsAvatarModalOpen(false)}
                    currentAvatarUrl={profile?.avatar_url}
                    userName={formData.full_name}
                    onAvatarUpdated={refreshProfile}
                />
            </div>
        </MainLayout>
    );
}
