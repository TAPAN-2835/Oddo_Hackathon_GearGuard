import { Plus, Wrench, Box, Calendar, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface QuickActionsProps {
  onCreateRequest: () => void;
  onAddEquipment: () => void;
  onSchedulePreventive: () => void;
}

export function QuickActions({ onCreateRequest, onAddEquipment, onSchedulePreventive }: QuickActionsProps) {
  return (
    <Card className="p-6 bg-card card-3d border-0 overflow-hidden relative">
      {/* Decorative gradient */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/10 via-transparent to-transparent pointer-events-none" />

      <div className="flex items-center gap-2 mb-5 relative z-10">
        <div className="p-2 rounded-lg bg-primary/10 icon-3d">
          <Sparkles className="w-4 h-4 text-primary" />
        </div>
        <h3 className="font-bold text-foreground">Quick Actions</h3>
      </div>

      <div className="space-y-3 relative z-10">
        <Button
          onClick={onCreateRequest}
          className="w-full justify-start gap-3 bg-primary hover:bg-primary/90 shadow-[0_4px_14px_hsl(239_84%_67%/0.4)] hover:shadow-[0_6px_20px_hsl(239_84%_67%/0.5)] hover:-translate-y-0.5 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Create Maintenance Request
        </Button>
        <Button
          onClick={onAddEquipment}
          variant="outline"
          className="w-full justify-start gap-3 border-border/50 hover:border-primary/40 hover:bg-primary/5 hover:-translate-y-0.5 transition-all shadow-sm cursor-pointer"
        >
          <Box className="w-4 h-4" />
          Add Equipment
        </Button>
        <Button
          onClick={onSchedulePreventive}
          variant="outline"
          className="w-full justify-start gap-3 border-border/50 hover:border-primary/40 hover:bg-primary/5 hover:-translate-y-0.5 transition-all shadow-sm cursor-pointer"
        >
          <Calendar className="w-4 h-4" />
          Schedule Preventive
        </Button>
      </div>
    </Card>
  );
}
