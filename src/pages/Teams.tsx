import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Plus, Mail, Phone } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar3D, AvatarStack } from '@/components/ui/avatar-3d';
import { Badge3D } from '@/components/ui/badge-3d';
import { getAllTeams } from '@/services/teams.service';
import { CreateTeamModal } from '@/components/modals/CreateTeamModal';

export default function Teams() {
    const [teams, setTeams] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    useEffect(() => {
        fetchTeams();
    }, []);

    const fetchTeams = async () => {
        try {
            const data = await getAllTeams();
            setTeams(data || []);
        } catch (error) {
            console.error('Error fetching teams:', error);
        } finally {
            setLoading(false);
        }
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
            <div className="space-y-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                >
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Maintenance Teams</h1>
                        <p className="text-muted-foreground mt-1">
                            Manage teams and assign technicians
                        </p>
                    </div>
                    <Button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="bg-primary hover:bg-primary/90 shadow-lg"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Create Team
                    </Button>
                </motion.div>

                {/* Teams Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {teams.map((team, index) => (
                        <motion.div
                            key={team.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card className="p-6 bg-card/80 backdrop-blur-sm border-border/50 hover:shadow-card-hover transition-all duration-300 group">
                                {/* Team Header */}
                                <div className="flex items-start justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="p-3 rounded-xl" style={{ backgroundColor: team.color + '20' }}>
                                            <Users className="w-6 h-6" style={{ color: team.color }} />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-foreground">{team.name}</h3>
                                            <p className="text-sm text-muted-foreground mt-0.5">{team.description || 'Maintenance Team'}</p>
                                        </div>
                                    </div>
                                    <Badge3D variant="active" size="sm">
                                        Active
                                    </Badge3D>
                                </div>

                                {/* Team Info */}
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Team Color</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: team.color }} />
                                            <p className="text-sm font-medium">{team.color}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Hover Actions */}
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    whileHover={{ opacity: 1, y: 0 }}
                                    className="mt-4 pt-4 border-t border-border/50 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm" className="flex-1">
                                            <Mail className="w-4 h-4 mr-2" />
                                            Contact
                                        </Button>
                                        <Button variant="outline" size="sm" className="flex-1">
                                            <Users className="w-4 h-4 mr-2" />
                                            Manage
                                        </Button>
                                    </div>
                                </motion.div>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {/* Note */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-sm text-muted-foreground p-4 bg-muted/20 rounded-lg border border-border/50"
                >
                    <p className="font-medium mb-2">Team Member Creation List View</p>
                    <p>
                        On clicking on the list of equipment Form should be open like above. Equipment List has been
                        used as a list view
                    </p>
                </motion.div>
            </div>

            <CreateTeamModal
                open={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
            />
        </MainLayout>
    );
}
