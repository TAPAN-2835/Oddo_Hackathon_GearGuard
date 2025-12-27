import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Settings, Bell, LogOut } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export function ProfileDropdown() {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

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

    const handleLogout = () => {
        localStorage.removeItem('isAuthenticated');
        sessionStorage.removeItem('hasSeenWelcome');
        navigate('/login');
    };

    const menuItems = [
        { icon: User, label: 'Profile', onClick: () => navigate('/profile') },
        { icon: Settings, label: 'Settings', onClick: () => navigate('/settings') },
        { icon: Bell, label: 'Notifications', onClick: () => navigate('/notifications') },
        { icon: LogOut, label: 'Logout', onClick: handleLogout, danger: true },
    ];

    return (
        <div className="relative" ref={dropdownRef}>
            <Avatar
                className="h-9 w-9 cursor-pointer ring-2 ring-primary/20 hover:ring-primary/40 transition-all"
                onClick={() => setIsOpen(!isOpen)}
            >
                <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground font-medium">
                    JD
                </AvatarFallback>
            </Avatar>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-card border border-border rounded-lg shadow-lg overflow-hidden z-50 animate-slide-in">
                    <div className="p-3 border-b border-border bg-secondary/50">
                        <p className="font-semibold text-sm text-foreground">John Doe</p>
                        <p className="text-xs text-muted-foreground">Admin</p>
                    </div>

                    <div className="py-1">
                        {menuItems.map((item, index) => (
                            <button
                                key={index}
                                onClick={() => {
                                    item.onClick();
                                    setIsOpen(false);
                                }}
                                className={`w-full px-4 py-2.5 text-left flex items-center gap-3 transition-colors ${item.danger
                                        ? 'hover:bg-destructive/10 text-destructive'
                                        : 'hover:bg-secondary text-foreground'
                                    }`}
                            >
                                <item.icon className="w-4 h-4" />
                                <span className="text-sm font-medium">{item.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
