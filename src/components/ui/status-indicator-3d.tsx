import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface StatusIndicator3DProps {
    status: 'active' | 'warning' | 'critical' | 'inactive';
    label?: string;
    size?: 'sm' | 'md' | 'lg';
    showPulse?: boolean;
}

const statusConfig = {
    active: {
        color: 'bg-success',
        glow: 'shadow-[0_0_12px_hsl(var(--success)/0.6)]',
        label: 'Active',
    },
    warning: {
        color: 'bg-warning',
        glow: 'shadow-[0_0_12px_hsl(var(--warning)/0.6)]',
        label: 'Warning',
    },
    critical: {
        color: 'bg-destructive',
        glow: 'shadow-[0_0_12px_hsl(var(--destructive)/0.6)]',
        label: 'Critical',
    },
    inactive: {
        color: 'bg-muted-foreground',
        glow: 'shadow-[0_0_12px_hsl(var(--muted-foreground)/0.4)]',
        label: 'Inactive',
    },
};

const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4',
};

export function StatusIndicator3D({
    status,
    label,
    size = 'md',
    showPulse = true,
}: StatusIndicator3DProps) {
    const config = statusConfig[status];

    return (
        <div className="flex items-center gap-2">
            <div className="relative">
                {/* Main dot */}
                <motion.div
                    className={cn(
                        'rounded-full',
                        config.color,
                        config.glow,
                        sizeClasses[size]
                    )}
                    animate={
                        showPulse
                            ? {
                                scale: [1, 1.2, 1],
                            }
                            : {}
                    }
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                />

                {/* Pulse ring */}
                {showPulse && (
                    <motion.div
                        className={cn(
                            'absolute inset-0 rounded-full',
                            config.color,
                            'opacity-50'
                        )}
                        animate={{
                            scale: [1, 2, 2],
                            opacity: [0.5, 0, 0],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: 'easeOut',
                        }}
                    />
                )}
            </div>

            {label && (
                <span className="text-sm font-medium text-foreground">
                    {label || config.label}
                </span>
            )}
        </div>
    );
}
