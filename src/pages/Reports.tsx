import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card } from '@/components/ui/card';
import { BarChart, Bar, PieChart, Pie, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { BarChart3, PieChart as PieChartIcon, TrendingUp, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { getRequestAnalytics } from '@/services/requests.service';

export default function Reports() {
    const [loading, setLoading] = useState(true);
    const [analytics, setAnalytics] = useState<any>({
        byTeam: [],
        byType: [],
        byStatus: [],
        overTime: [],
        totalRequests: 0,
        completed: 0,
        inProgress: 0,
        avgTime: 0,
    });

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            const data = await getRequestAnalytics();
            setAnalytics(data);
        } catch (error) {
            console.error('Error fetching analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleExport = () => {
        toast({
            title: 'Export Started',
            description: 'Your report is being generated and will download shortly.',
        });
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
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Reports & Analytics</h1>
                        <p className="text-muted-foreground mt-1">Maintenance insights and performance metrics</p>
                    </div>
                    <Button onClick={handleExport} className="gap-2">
                        <Download className="w-4 h-4" />
                        Export Report
                    </Button>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Total Requests</p>
                                <p className="text-2xl font-bold text-foreground">{analytics.totalRequests}</p>
                            </div>
                            <div className="p-3 bg-primary/10 rounded-lg">
                                <BarChart3 className="w-6 h-6 text-primary" />
                            </div>
                        </div>
                    </Card>
                    <Card className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Completed</p>
                                <p className="text-2xl font-bold text-success">{analytics.completed}</p>
                            </div>
                            <div className="p-3 bg-success/10 rounded-lg">
                                <TrendingUp className="w-6 h-6 text-success" />
                            </div>
                        </div>
                    </Card>
                    <Card className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">In Progress</p>
                                <p className="text-2xl font-bold text-warning">{analytics.inProgress}</p>
                            </div>
                            <div className="p-3 bg-warning/10 rounded-lg">
                                <PieChartIcon className="w-6 h-6 text-warning" />
                            </div>
                        </div>
                    </Card>
                    <Card className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Avg. Time</p>
                                <p className="text-2xl font-bold text-foreground">{analytics.avgTime}h</p>
                            </div>
                            <div className="p-3 bg-info/10 rounded-lg">
                                <BarChart3 className="w-6 h-6 text-info" />
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Requests by Team */}
                    <Card className="p-6">
                        <h3 className="text-lg font-semibold text-foreground mb-4">Requests per Team</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={analytics.byTeam}>
                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                                <XAxis dataKey="team" stroke="hsl(var(--muted-foreground))" />
                                <YAxis stroke="hsl(var(--muted-foreground))" />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'hsl(var(--card))',
                                        border: '1px solid hsl(var(--border))',
                                        borderRadius: '0.5rem',
                                    }}
                                />
                                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </Card>

                    {/* Requests by Category */}
                    <Card className="p-6">
                        <h3 className="text-lg font-semibold text-foreground mb-4">Requests per Type</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={analytics.byType}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ type, percent }) => `${type} ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="count"
                                >
                                    {analytics.byType.map((entry: any, index: number) => (
                                        <Cell key={`cell-${index}`} fill={entry.type === 'Preventive' ? '#22c55e' : '#f59e0b'} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'hsl(var(--card))',
                                        border: '1px solid hsl(var(--border))',
                                        borderRadius: '0.5rem',
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </Card>

                    {/* Requests Over Time */}
                    <Card className="p-6">
                        <h3 className="text-lg font-semibold text-foreground mb-4">Requests Over Time</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={analytics.overTime}>
                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                                <YAxis stroke="hsl(var(--muted-foreground))" />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'hsl(var(--card))',
                                        border: '1px solid hsl(var(--border))',
                                        borderRadius: '0.5rem',
                                    }}
                                />
                                <Line type="monotone" dataKey="count" stroke="hsl(var(--primary))" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </Card>

                    {/* Status Distribution */}
                    <Card className="p-6">
                        <h3 className="text-lg font-semibold text-foreground mb-4">Status Distribution</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={analytics.byStatus}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    paddingAngle={5}
                                    dataKey="count"
                                    label={({ status, count }) => `${status}: ${count}`}
                                >
                                    {analytics.byStatus.map((entry: any, index: number) => {
                                        const colors: any = {
                                            'New': '#3b82f6',
                                            'In Progress': '#f59e0b',
                                            'Repaired': '#22c55e',
                                            'Scrap': '#ef4444',
                                        };
                                        return <Cell key={`cell-${index}`} fill={colors[entry.status] || '#8884d8'} />;
                                    })}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'hsl(var(--card))',
                                        border: '1px solid hsl(var(--border))',
                                        borderRadius: '0.5rem',
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </Card>
                </div>
            </div>
        </MainLayout>
    );
}
