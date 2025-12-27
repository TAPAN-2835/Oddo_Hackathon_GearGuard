import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, Settings } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { getAllWorkCenters } from '@/services/workcenters.service';
import { AddWorkCenterModal } from '@/components/modals/AddWorkCenterModal';

export default function WorkCenters() {
    const [searchQuery, setSearchQuery] = useState('');
    const [workCenters, setWorkCenters] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    useEffect(() => {
        fetchWorkCenters();
    }, []);

    const fetchWorkCenters = async () => {
        try {
            const data = await getAllWorkCenters();
            setWorkCenters(data || []);
        } catch (error) {
            console.error('Error fetching work centers:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredWorkCenters = workCenters.filter((wc) =>
        wc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        wc.code?.toLowerCase().includes(searchQuery.toLowerCase())
    );

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
                        <h1 className="text-3xl font-bold text-foreground">Work Centers</h1>
                        <p className="text-muted-foreground mt-1">
                            Manage work centers and their configurations
                        </p>
                    </div>
                    <Button
                        onClick={() => setIsAddModalOpen(true)}
                        className="bg-primary hover:bg-primary/90 shadow-lg"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Work Center
                    </Button>
                </motion.div>

                {/* Search */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <Card className="p-4 bg-card/80 backdrop-blur-sm border-border/50">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                placeholder="Search work centers..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9 bg-background/50 border-border/50 focus:border-primary/50"
                            />
                        </div>
                    </Card>
                </motion.div>

                {/* Table */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <Card className="bg-card/80 backdrop-blur-sm border-border/50 overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/50 hover:bg-muted/70">
                                    <TableHead className="font-semibold">Work Center</TableHead>
                                    <TableHead className="font-semibold">Location</TableHead>
                                    <TableHead className="font-semibold">Description</TableHead>
                                    <TableHead className="font-semibold text-right">Capacity</TableHead>
                                    <TableHead className="font-semibold text-center">Status</TableHead>
                                    <TableHead className="font-semibold text-center">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredWorkCenters.map((wc, index) => (
                                    <motion.tr
                                        key={wc.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="hover:bg-muted/30 transition-colors"
                                    >
                                        <TableCell className="font-medium">{wc.name}</TableCell>
                                        <TableCell className="text-muted-foreground">{wc.location || '-'}</TableCell>
                                        <TableCell className="text-muted-foreground max-w-[200px] truncate">{wc.description || '-'}</TableCell>
                                        <TableCell className="text-right font-mono">{wc.capacity}</TableCell>
                                        <TableCell className="text-center">
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${wc.status === 'Active' ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'
                                                }`}>
                                                {wc.status}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Button variant="ghost" size="sm">
                                                <Settings className="w-4 h-4" />
                                            </Button>
                                        </TableCell>
                                    </motion.tr>
                                ))}
                            </TableBody>
                        </Table>
                    </Card>
                </motion.div>

                {/* Note */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-sm text-muted-foreground"
                >
                    <p>
                        Note: Must create a work center proper form view with respective Field that are needed in
                        work center for maintenance request
                    </p>
                    <p className="mt-1">
                        If work center is selected then instead of equipment field there should be Work center field
                        then one have to select specific work center where the request should be done
                    </p>
                </motion.div>
            </div>

            <AddWorkCenterModal
                open={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
            />
        </MainLayout>
    );
}
