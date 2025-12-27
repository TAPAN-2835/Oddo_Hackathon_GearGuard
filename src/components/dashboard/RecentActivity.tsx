import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge3D } from '@/components/ui/badge-3d';
import { Avatar3D } from '@/components/ui/avatar-3d';
import { getAllRequests } from '@/services/requests.service';
import { Activity } from 'lucide-react';

const statusVariants = {
  'New': 'new',
  'In Progress': 'inProgress',
  'Repaired': 'repaired',
  'Scrap': 'scrap',
} as const;

export function RecentActivity() {
  const [recentRequests, setRecentRequests] = useState<any[]>([]);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const requests = await getAllRequests();
        setRecentRequests(requests?.slice(0, 5) || []);
      } catch (error) {
        console.error('Error fetching recent activity:', error);
      }
    };
    fetchActivity();
  }, []);

  return (
    <Card className="p-6 bg-card card-3d border-0 overflow-hidden relative">
      {/* Decorative gradient */}
      <div className="absolute top-0 left-0 w-40 h-40 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />

      <div className="flex items-center justify-between mb-5 relative z-10">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-primary/10 icon-3d">
            <Activity className="w-4 h-4 text-primary" />
          </div>
          <h3 className="font-bold text-foreground">Recent Activity</h3>
        </div>
        <a href="/kanban" className="text-sm text-primary hover:text-primary/80 font-semibold transition-colors">
          View all →
        </a>
      </div>

      <div className="space-y-3 relative z-10">
        {recentRequests.map((request, index) => (
          <div
            key={request.id}
            className="flex items-center gap-4 p-4 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-all duration-200 hover:shadow-md cursor-pointer group animate-slide-up"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <Avatar3D
              initials={request.technician?.profiles?.full_name || '?'}
              src={request.technician?.profiles?.avatar_url}
              size="md"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                {request.subject}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {request.equipment?.name || 'No equipment'} • {request.technician?.profiles?.full_name || 'Unassigned'}
              </p>
            </div>
            <Badge3D variant={statusVariants[request.status]} size="sm">
              {request.status}
            </Badge3D>
          </div>
        ))}
      </div>
    </Card>
  );
}
