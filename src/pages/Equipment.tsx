import { useState, useEffect } from 'react';
import { Plus, Search, Trash2, Wrench, Box, Filter } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Badge3D } from '@/components/ui/badge-3d';
import { EquipmentIcon } from '@/components/equipment/EquipmentIcon';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getAllEquipment, deleteEquipment, subscribeToEquipment } from '@/services/equipment.service';
import { getRequestsByEquipment } from '@/services/requests.service';
import { AddEquipmentModal } from '@/components/modals/AddEquipmentModal';
import { EquipmentRequestsModal } from '@/components/modals/EquipmentRequestsModal';
import { toast } from '@/hooks/use-toast';

export default function Equipment() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [equipment, setEquipment] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState<any>(null);
  const [equipmentRequests, setEquipmentRequests] = useState<any[]>([]);
  const [isRequestsModalOpen, setIsRequestsModalOpen] = useState(false);

  useEffect(() => {
    fetchEquipment();

    // Real-time subscription
    const subscription = subscribeToEquipment(() => {
      fetchEquipment();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchEquipment = async () => {
    try {
      setError(null);
      const data = await getAllEquipment();
      setEquipment(data || []);
    } catch (error: any) {
      console.error('Error fetching equipment:', error);
      setError(error.message || 'Failed to load equipment');
    } finally {
      setLoading(false);
    }
  };

  const handleViewRequests = async (eq: any) => {
    try {
      const requests = await getRequestsByEquipment(eq.id);
      setSelectedEquipment(eq);
      setEquipmentRequests(requests || []);
      setIsRequestsModalOpen(true);
    } catch (error) {
      console.error('Error fetching requests:', error);
      toast({
        title: 'Error',
        description: 'Failed to load maintenance requests',
        variant: 'destructive',
      });
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

  if (error) {
    return (
      <MainLayout>
        <div className="p-8 text-center text-red-500 bg-red-50 rounded-lg">
          <h2 className="text-xl font-bold mb-2">Error Loading Equipment</h2>
          <pre className="text-sm bg-white p-4 rounded border border-red-200 inline-block text-left">
            {JSON.stringify(error, null, 2)}
          </pre>
          <div className="mt-4">
            <Button onClick={fetchEquipment} variant="outline">Retry</Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  const filteredEquipment = equipment.filter((eq) => {
    const matchesSearch = eq.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      eq.location?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || eq.category?.name === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-slide-up">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Equipment</h1>
            <p className="text-muted-foreground mt-1">
              Manage and monitor all your assets
            </p>
          </div>
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-primary hover:bg-primary/90 shadow-[0_4px_14px_hsl(239_84%_67%/0.4)] hover:shadow-[0_6px_20px_hsl(239_84%_67%/0.5)] transition-all"
          >
            <Box className="w-4 h-4 mr-2" />
            Add Equipment
          </Button>
        </div>

        {/* Filters - 3D Card */}
        <Card className="p-4 bg-card card-3d border-0">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search equipment..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 border-border/50 focus:border-primary/50 transition-colors"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-48 border-border/50">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Machine">Machine</SelectItem>
                <SelectItem value="IT">IT</SelectItem>
                <SelectItem value="Vehicle">Vehicle</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Equipment Grid - 3D Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredEquipment.map((eq, index) => (
            <Card
              key={eq.id}
              className="p-5 bg-card card-3d border-0 cursor-pointer group animate-slide-up overflow-hidden relative"
              style={{ animationDelay: `${index * 50} ms` }}
            >
              {/* Subtle gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-primary/[0.02] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="flex items-start gap-4 relative z-10">
                {/* 3D Equipment Icon */}
                <EquipmentIcon
                  category={eq.category?.name || 'Machine'}
                  name={eq.name}
                  size="md"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-foreground truncate">
                      {eq.name}
                    </h3>
                    <Badge3D variant={eq.status === 'Active' ? 'active' : 'scrap'} size="sm">
                      {eq.status}
                    </Badge3D>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {eq.location || 'Main Facility'}
                  </p>
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50">
                    <div>
                      <p className="text-xs text-muted-foreground">Team</p>
                      <p className="text-sm font-medium text-foreground">{eq.team?.name || 'Unassigned'}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge3D variant={eq.status === 'Active' ? 'repaired' : 'scrap'} size="sm">
                        {eq.status}
                      </Badge3D>
                      {eq.category?.name && (
                        <Badge3D variant="new" size="sm">
                          {eq.category.name}
                        </Badge3D>
                      )}
                    </div>
                  </div>

                  {/* Smart Buttons */}
                  <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border/50">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewRequests(eq)}
                      className="flex-1 relative"
                    >
                      <Wrench className="w-4 h-4 mr-2" />
                      Maintenance
                      {/* Badge with count */}
                      <Badge className="ml-2 bg-primary text-primary-foreground">
                        {eq.open_requests_count || 0}
                      </Badge>
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
          {filteredEquipment.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No equipment found</p>
            </div>
          )}
        </div>
      </div>

      <AddEquipmentModal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      <EquipmentRequestsModal
        open={isRequestsModalOpen}
        onClose={() => setIsRequestsModalOpen(false)}
        equipment={selectedEquipment}
        requests={equipmentRequests}
      />
    </MainLayout>
  );
}
