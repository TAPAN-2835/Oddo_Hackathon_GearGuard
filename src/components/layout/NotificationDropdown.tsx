import { useState, useRef, useEffect } from 'react';
import { Bell, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Notification {
    id: string;
    title: string;
    message: string;
    time: string;
    type: 'success' | 'warning' | 'info';
    read: boolean;
}

const mockNotifications: Notification[] = [
    {
        id: '1',
        title: 'New Maintenance Request',
        message: 'Request #1234 has been assigned to your team',
        time: '5 min ago',
        type: 'info',
        read: false,
    },
    {
        id: '2',
        title: 'Equipment Needs Attention',
        message: 'PM-2024-001 requires preventive maintenance',
        time: '1 hour ago',
        type: 'warning',
        read: false,
    },
    {
        id: '3',
        title: 'Request Completed',
        message: 'Maintenance request #1230 marked as completed',
        time: '2 hours ago',
        type: 'success',
        read: true,
    },
    {
        id: '4',
        title: 'Preventive Maintenance Scheduled',
        message: 'PM scheduled for Hydraulic Press on Dec 28',
        time: '3 hours ago',
        type: 'info',
        read: true,
    },
];

export function NotificationDropdown() {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState(mockNotifications);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const unreadCount = notifications.filter(n => !n.read).length;

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const markAsRead = (id: string) => {
        setNotifications(prev =>
            prev.map(n => (n.id === id ? { ...n, read: true } : n))
        );
    };

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'success':
                return <CheckCircle className="w-4 h-4 text-success" />;
            case 'warning':
                return <AlertCircle className="w-4 h-4 text-warning" />;
            default:
                return <Clock className="w-4 h-4 text-info" />;
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <Button
                variant="ghost"
                size="icon"
                className="relative"
                onClick={() => setIsOpen(!isOpen)}
            >
                <Bell className="w-5 h-5 text-muted-foreground" />
                {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full animate-pulse-subtle" />
                )}
            </Button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-card border border-border rounded-lg shadow-lg overflow-hidden z-50 animate-slide-in">
                    <div className="p-3 border-b border-border bg-secondary/50 flex items-center justify-between">
                        <div>
                            <h3 className="font-semibold text-sm text-foreground">Notifications</h3>
                            {unreadCount > 0 && (
                                <p className="text-xs text-muted-foreground">{unreadCount} unread</p>
                            )}
                        </div>
                        {unreadCount > 0 && (
                            <button
                                onClick={markAllAsRead}
                                className="text-xs text-primary hover:text-primary/80 font-medium transition-colors"
                            >
                                Mark all read
                            </button>
                        )}
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-8 text-center text-muted-foreground text-sm">
                                No notifications
                            </div>
                        ) : (
                            notifications.map(notification => (
                                <div
                                    key={notification.id}
                                    onClick={() => markAsRead(notification.id)}
                                    className={`p-3 border-b border-border/50 cursor-pointer transition-colors ${notification.read ? 'bg-card' : 'bg-secondary/30 hover:bg-secondary/50'
                                        }`}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="mt-0.5">{getIcon(notification.type)}</div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-sm text-foreground truncate">
                                                {notification.title}
                                            </p>
                                            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                                                {notification.message}
                                            </p>
                                            <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                                        </div>
                                        {!notification.read && (
                                            <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="p-2 border-t border-border bg-secondary/30">
                        <button className="w-full text-center text-sm text-primary hover:text-primary/80 font-medium py-2 transition-colors">
                            View all notifications
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
