import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge3D } from '@/components/ui/badge-3d';
import { AddRequestModal } from '@/components/modals/AddRequestModal';
import { getAllRequests, subscribeToRequests } from '@/services/requests.service';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [calendarEvents, setCalendarEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();

    // Real-time subscription
    const subscription = subscribeToRequests(() => {
      fetchEvents();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchEvents = async () => {
    try {
      const requests = await getAllRequests();
      // Filter only PREVENTIVE requests with scheduled dates
      const events = requests
        ?.filter(r => r.type === 'Preventive' && r.scheduled_date)
        ?.map(r => ({
          date: r.scheduled_date?.split('T')[0] || '',
          title: r.subject,
          type: r.type,
          id: r.id,
          equipment: r.equipment?.name,
        })) || [];
      setCalendarEvents(events);
    } catch (error) {
      console.error('Error fetching calendar events:', error);
    } finally {
      setLoading(false);
    }
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const startingDayOfWeek = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const getEventsForDate = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return calendarEvents.filter(event => event.date === dateStr);
  };

  const handleDateClick = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setSelectedDate(dateStr);
    setIsCreateModalOpen(true);
  };

  const calendarDays = [];

  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(null);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-slide-up">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Maintenance Calendar</h1>
            <p className="text-muted-foreground mt-1">
              Schedule and view preventive maintenance
            </p>
          </div>
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-primary hover:bg-primary/90 shadow-[0_4px_14px_hsl(239_84%_67%/0.4)] hover:shadow-[0_6px_20px_hsl(239_84%_67%/0.5)] transition-all"
          >
            <Plus className="w-4 h-4 mr-2" />
            Schedule Maintenance
          </Button>
        </div>

        {/* Calendar - 3D Card */}
        <Card className="p-6 bg-card card-3d-raised border-0 animate-slide-up">
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-foreground">
              {MONTHS[month]} {year}
            </h2>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={prevMonth}
                className="border-border/50 hover:bg-secondary hover:border-primary/30 transition-all shadow-sm"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={nextMonth}
                className="border-border/50 hover:bg-secondary hover:border-primary/30 transition-all shadow-sm"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Days Header */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {DAYS.map(day => (
              <div key={day} className="p-2 text-center text-sm font-semibold text-muted-foreground">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1.5">
            {calendarDays.map((day, index) => {
              if (day === null) {
                return <div key={`empty-${index}`} className="aspect-square p-1" />;
              }

              const events = getEventsForDate(day);
              const isToday = day === 15;

              return (
                <div
                  key={day}
                  onClick={() => handleDateClick(day)}
                  className={`aspect-square p-2 rounded-xl transition-all duration-200 cursor-pointer group ${isToday
                    ? 'bg-primary/10 ring-2 ring-primary/30 shadow-[0_0_15px_hsl(239_84%_67%/0.2)]'
                    : 'hover:bg-secondary/80 hover:shadow-md'
                    } ${events.length > 0 ? 'bg-secondary/40' : ''}`}
                >
                  <div className="h-full flex flex-col">
                    <span className={`text-sm font-semibold ${isToday ? 'text-primary' : 'text-foreground'} group-hover:text-primary transition-colors`}>
                      {day}
                    </span>
                    <div className="flex-1 mt-1 space-y-0.5 overflow-hidden">
                      {events.slice(0, 2).map((event, idx) => (
                        <div
                          key={idx}
                          className={`text-[10px] px-1.5 py-0.5 rounded-md truncate font-medium transition-transform group-hover:scale-[1.02] ${event.type === 'Preventive'
                            ? 'bg-primary text-primary-foreground shadow-[0_2px_6px_hsl(239_84%_67%/0.3)]'
                            : 'bg-warning text-warning-foreground shadow-[0_2px_6px_hsl(38_92%_50%/0.3)]'
                            }`}
                        >
                          {event.title}
                        </div>
                      ))}
                      {events.length > 2 && (
                        <div className="text-[10px] text-muted-foreground px-1 font-medium">
                          +{events.length - 2} more
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-6 mt-6 pt-4 border-t border-border/50">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-md bg-primary shadow-[0_2px_6px_hsl(239_84%_67%/0.4)]" />
              <span className="text-sm text-muted-foreground font-medium">Preventive</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-md bg-warning shadow-[0_2px_6px_hsl(38_92%_50%/0.4)]" />
              <span className="text-sm text-muted-foreground font-medium">Corrective</span>
            </div>
          </div>
        </Card>

        {/* Upcoming Events - 3D Cards */}
        <Card className="p-6 bg-card card-3d border-0 animate-slide-up">
          <h3 className="font-bold text-foreground mb-4">Upcoming Maintenance</h3>
          <div className="space-y-3">
            {calendarEvents.slice(0, 5).map((event, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-all duration-200 hover:shadow-md cursor-pointer group"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-1.5 h-12 rounded-full transition-all group-hover:scale-y-110 ${event.type === 'Preventive'
                      ? 'bg-primary shadow-[0_0_8px_hsl(239_84%_67%/0.5)]'
                      : 'bg-warning shadow-[0_0_8px_hsl(38_92%_50%/0.5)]'
                      }`}
                  />
                  <div>
                    <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{event.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{event.date}</p>
                  </div>
                </div>
                <Badge3D variant={event.type === 'Preventive' ? 'preventive' : 'corrective'} size="sm">
                  {event.type}
                </Badge3D>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Add Request Modal */}
      <AddRequestModal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </MainLayout>
  );
}
