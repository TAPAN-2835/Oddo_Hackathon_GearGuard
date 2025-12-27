import { useState, useEffect } from 'react';
import { Box, ClipboardList, Loader2, CheckCircle2 } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { CreateRequestModal } from '@/components/modals/CreateRequestModal';
import { AddEquipmentModal } from '@/components/modals/AddEquipmentModal';
import { SchedulePreventiveModal } from '@/components/modals/SchedulePreventiveModal';
import { getAllEquipment } from '@/services/equipment.service';
import { getAllRequests } from '@/services/requests.service';

export default function Dashboard() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAddEquipmentModalOpen, setIsAddEquipmentModalOpen] = useState(false);
  const [isSchedulePreventiveModalOpen, setIsSchedulePreventiveModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEquipment: 0,
    openRequests: 0,
    inProgress: 0,
    completed: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [equipmentData, requestsData] = await Promise.all([
          getAllEquipment(),
          getAllRequests(),
        ]);

        setStats({
          totalEquipment: equipmentData?.length || 0,
          openRequests: requestsData?.filter(r => r.status === 'New').length || 0,
          inProgress: requestsData?.filter(r => r.status === 'In Progress').length || 0,
          completed: requestsData?.filter(r => r.status === 'Repaired').length || 0,
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
      {/* Vibrant Background Pattern */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-background" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-3xl opacity-30" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-accent/20 to-primary/20 rounded-full blur-3xl opacity-30" />
        {/* Mesh Pattern */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="dashboardGrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="20" cy="20" r="1" fill="currentColor" className="text-primary" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dashboardGrid)" />
        </svg>
      </div>

      <div className="space-y-8 relative">
        {/* Header with gradient text */}
        <div className="animate-slide-up">
          <h1 className="text-4xl font-black bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent tracking-tight">
            Dashboard
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Welcome back! Here's an overview of your maintenance operations.
          </p>
        </div>

        {/* Stats Grid - Vibrant 3D Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Equipment"
            value={stats.totalEquipment}
            icon={<Box className="w-6 h-6" />}
            color="primary"
          />
          <StatCard
            title="Open Requests"
            value={stats.openRequests}
            icon={<ClipboardList className="w-6 h-6" />}
            trend={{ value: '2 new today', positive: false }}
            color="destructive"
          />
          <StatCard
            title="In Progress"
            value={stats.inProgress}
            icon={<Loader2 className="w-6 h-6" />}
            color="warning"
          />
          <StatCard
            title="Completed"
            value={stats.completed}
            icon={<CheckCircle2 className="w-6 h-6" />}
            trend={{ value: '12% vs last week', positive: true }}
            color="success"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RecentActivity />
          </div>
          <div>
            <QuickActions
              onCreateRequest={() => setIsCreateModalOpen(true)}
              onAddEquipment={() => setIsAddEquipmentModalOpen(true)}
              onSchedulePreventive={() => setIsSchedulePreventiveModalOpen(true)}
            />
          </div>
        </div>
      </div>

      <CreateRequestModal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
      <AddEquipmentModal
        open={isAddEquipmentModalOpen}
        onClose={() => setIsAddEquipmentModalOpen(false)}
      />
      <SchedulePreventiveModal
        open={isSchedulePreventiveModalOpen}
        onClose={() => setIsSchedulePreventiveModalOpen(false)}
      />
    </MainLayout>
  );
}
