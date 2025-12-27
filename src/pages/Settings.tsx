import { MainLayout } from '@/components/layout/MainLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Settings as SettingsIcon, Bell, Palette, Shield, Sparkles } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function Settings() {
    const handleSave = () => {
        toast({
            title: 'Settings Saved',
            description: 'Your preferences have been updated successfully.',
        });
    };

    return (
        <MainLayout>
            <div className="max-w-4xl mx-auto space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Settings</h1>
                    <p className="text-muted-foreground mt-1">Manage your application preferences</p>
                </div>

                {/* Notifications Settings */}
                <Card className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-lg bg-primary/10">
                            <Bell className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-foreground">Notifications</h3>
                            <p className="text-sm text-muted-foreground">Configure how you receive notifications</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <Label htmlFor="email-notifications" className="text-base">Email Notifications</Label>
                                <p className="text-sm text-muted-foreground">Receive email updates for new requests</p>
                            </div>
                            <Switch id="email-notifications" defaultChecked />
                        </div>

                        <div className="flex items-center justify-between">
                            <div>
                                <Label htmlFor="push-notifications" className="text-base">Push Notifications</Label>
                                <p className="text-sm text-muted-foreground">Get notified about urgent maintenance</p>
                            </div>
                            <Switch id="push-notifications" defaultChecked />
                        </div>

                        <div className="flex items-center justify-between">
                            <div>
                                <Label htmlFor="weekly-summary" className="text-base">Weekly Summary</Label>
                                <p className="text-sm text-muted-foreground">Receive weekly maintenance reports</p>
                            </div>
                            <Switch id="weekly-summary" />
                        </div>
                    </div>
                </Card>



                {/* Security Settings */}
                <Card className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-lg bg-success/10">
                            <Shield className="w-5 h-5 text-success" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-foreground">Security</h3>
                            <p className="text-sm text-muted-foreground">Manage your account security</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <Label htmlFor="two-factor" className="text-base">Two-Factor Authentication</Label>
                                <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                            </div>
                            <Switch id="two-factor" />
                        </div>

                        <div className="flex items-center justify-between">
                            <div>
                                <Label htmlFor="session-timeout" className="text-base">Auto Logout</Label>
                                <p className="text-sm text-muted-foreground">Logout after 30 minutes of inactivity</p>
                            </div>
                            <Switch id="session-timeout" defaultChecked />
                        </div>

                        <Button variant="outline" className="w-full mt-2">
                            Change Password
                        </Button>
                    </div>
                </Card>

                {/* Save Button */}
                <div className="flex gap-3">
                    <Button onClick={handleSave} className="flex-1">
                        <SettingsIcon className="w-4 h-4 mr-2" />
                        Save Settings
                    </Button>
                    <Button variant="outline" className="flex-1">
                        Reset to Defaults
                    </Button>
                </div>
            </div>
        </MainLayout>
    );
}
