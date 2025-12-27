import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Plus, AlertCircle } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge3D } from '@/components/ui/badge-3d';
import { Avatar3D } from '@/components/ui/avatar-3d';
import { AddRequestModal } from '@/components/modals/AddRequestModal';
import { getAllRequests, updateRequest, subscribeToRequests } from '@/services/requests.service';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';

type ColumnId = 'New' | 'In Progress' | 'Repaired' | 'Scrap';

interface Column {
  id: ColumnId;
  title: string;
  variant: 'new' | 'inProgress' | 'repaired' | 'scrap';
  bgColor: string;
  borderColor: string;
  headerBg: string;
}

const columns: Column[] = [
  { id: 'New', title: 'New', variant: 'new', bgColor: 'bg-info/5', borderColor: 'border-info/20', headerBg: 'bg-gradient-to-r from-info/15 via-info/10 to-info/5' },
  { id: 'In Progress', title: 'In Progress', variant: 'inProgress', bgColor: 'bg-warning/5', borderColor: 'border-warning/20', headerBg: 'bg-gradient-to-r from-warning/15 via-warning/10 to-warning/5' },
  { id: 'Repaired', title: 'Repaired', variant: 'repaired', bgColor: 'bg-success/5', borderColor: 'border-success/20', headerBg: 'bg-gradient-to-r from-success/15 via-success/10 to-success/5' },
  { id: 'Scrap', title: 'Scrap', variant: 'scrap', bgColor: 'bg-destructive/5', borderColor: 'border-destructive/20', headerBg: 'bg-gradient-to-r from-destructive/15 via-destructive/10 to-destructive/5' },
];

export default function Kanban() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

  useEffect(() => {
    fetchRequests();

    // Real-time subscription
    const subscription = subscribeToRequests(() => {
      fetchRequests();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchRequests = async () => {
    try {
      setError(null);
      const data = await getAllRequests();
      setRequests(data || []);
    } catch (error: any) {
      console.error('Error fetching requests:', error);
      setError(error.message || 'Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  const getColumnRequests = (status: ColumnId) => {
    return requests.filter(req => req.status === status);
  };

  const handleDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const newStatus = destination.droppableId as ColumnId;

    // Optimistic update
    const updatedRequests = requests.map(req => {
      if (req.id === draggableId) {
        return { ...req, status: newStatus };
      }
      return req;
    });
    setRequests(updatedRequests);

    // Update in database
    try {
      await updateRequest(draggableId, { status: newStatus });

      // SCRAP LOGIC: If moved to Scrap, mark equipment as unusable
      if (newStatus === 'Scrap') {
        const movedRequest = requests.find(r => r.id === draggableId);
        if (movedRequest?.equipment_id) {
          // Update equipment status to Scrap
          await supabase
            .from('equipment')
            .update({ status: 'Scrap' })
            .eq('id', movedRequest.equipment_id);

          toast({
            title: 'Equipment Scrapped',
            description: `Equipment "${movedRequest.equipment?.name}" has been marked as Scrap`,
            variant: 'destructive',
          });
        }
      }

      const movedRequest = requests.find(r => r.id === draggableId);
      if (movedRequest) {
        toast({
          title: 'Status Updated',
          description: `"${movedRequest.subject}" moved to ${newStatus}`,
        });
      }
    } catch (error) {
      // Revert on error
      setRequests(requests);
      toast({
        title: 'Error',
        description: 'Failed to update status',
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

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-slide-up">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Maintenance Requests</h1>
            <p className="text-muted-foreground mt-1">
              Manage and track all maintenance requests
            </p>
          </div>
          <Button
            onClick={() => setIsRequestModalOpen(true)}
            className="bg-primary hover:bg-primary/90 shadow-[0_4px_14px_hsl(239_84%_67%/0.4)] hover:shadow-[0_6px_20px_hsl(239_84%_67%/0.5)] transition-all"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Request
          </Button>
        </div>

        {/* Kanban Board */}
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {columns.map((column) => (
              <div key={column.id} className="flex flex-col animate-slide-up">
                {/* Column Header - 3D Style */}
                <div className={`p-4 rounded-t-xl ${column.headerBg} border-b-2 ${column.borderColor} backdrop-blur-sm`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge3D variant={column.variant} size="md">
                        {column.title}
                      </Badge3D>
                    </div>
                    <span className="text-sm font-bold text-foreground/70 bg-card/50 px-2 py-0.5 rounded-full shadow-sm">
                      {getColumnRequests(column.id).length}
                    </span>
                  </div>
                </div>

                {/* Column Body */}
                <Droppable droppableId={column.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`flex-1 p-3 rounded-b-xl border border-t-0 transition-all duration-300 min-h-[450px] ${snapshot.isDraggingOver
                        ? `${column.bgColor} ${column.borderColor} ring-2 ring-inset ring-primary/20`
                        : 'bg-secondary/20 border-border/50'
                        }`}
                    >
                      <div className="space-y-3">
                        {getColumnRequests(column.id).map((request, index) => (
                          <Draggable key={request.id} draggableId={request.id} index={index}>
                            {(provided, snapshot) => (
                              <Card
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`p-4 bg-card cursor-grab active:cursor-grabbing border-0 transition-all duration-200 ${snapshot.isDragging
                                  ? 'shadow-card-float rotate-2 scale-[1.02] ring-2 ring-primary/30'
                                  : 'shadow-card hover:shadow-card-hover hover:-translate-y-0.5'
                                  } ${request.isOverdue ? 'ring-2 ring-destructive/50 animate-pulse-subtle' : ''}`}
                              >
                                {/* Overdue indicator */}
                                {request.isOverdue && (
                                  <div className="flex items-center gap-1.5 mb-2">
                                    <Badge3D variant="scrap" size="sm">
                                      <AlertCircle className="w-3 h-3 mr-1" />
                                      Overdue
                                    </Badge3D>
                                  </div>
                                )}

                                {/* Title */}
                                <h4 className="font-semibold text-foreground text-sm leading-snug">
                                  {request.subject}
                                </h4>

                                {/* Equipment */}
                                <p className="text-xs text-muted-foreground mt-1.5">
                                  {request.equipment?.name || 'No equipment'}
                                </p>

                                {/* Footer */}
                                <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/50">
                                  <div className="flex items-center gap-2">
                                    <Badge3D
                                      variant={request.type === 'Preventive' ? 'preventive' : 'corrective'}
                                      size="sm"
                                    >
                                      {request.type}
                                    </Badge3D>
                                    <Badge3D variant={request.priority === 'High' || request.priority === 'Critical' ? 'scrap' : 'new'} size="sm">
                                      {request.priority}
                                    </Badge3D>
                                  </div>

                                  {/* Technician Avatar */}
                                  {request.technician?.profiles ? (
                                    <div className="flex items-center gap-2">
                                      <Avatar3D
                                        src={request.technician.profiles.avatar_url}
                                        fallback={request.technician.profiles.full_name?.[0] || 'T'}
                                        size="sm"
                                      />
                                      <span className="text-xs text-muted-foreground">
                                        {request.technician.profiles.full_name}
                                      </span>
                                    </div>
                                  ) : (
                                    <span className="text-xs text-muted-foreground italic">Unassigned</span>
                                  )}
                                </div>
                              </Card>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
        </DragDropContext>

        {/* Add Request Modal */}
        <AddRequestModal
          open={isRequestModalOpen}
          onClose={() => setIsRequestModalOpen(false)}
        />
      </div>
    </MainLayout>
  );
}

