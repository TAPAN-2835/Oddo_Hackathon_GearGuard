import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface EquipmentIcon3DProps {
    Icon: LucideIcon;
    category: 'Machine' | 'IT' | 'Vehicle';
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-14 h-14',
    lg: 'w-20 h-20',
};

const iconSizes = {
    sm: 'w-5 h-5',
    md: 'w-7 h-7',
    lg: 'w-10 h-10',
};

const categoryColors = {
    Machine: {
        bg: 'from-warning/20 via-warning/10 to-warning/5',
        glow: 'shadow-[0_0_20px_hsl(var(--warning)/0.3)]',
        icon: 'text-warning',
    },
    IT: {
        bg: 'from-info/20 via-info/10 to-info/5',
        glow: 'shadow-[0_0_20px_hsl(var(--info)/0.3)]',
        icon: 'text-info',
    },
    Vehicle: {
        bg: 'from-success/20 via-success/10 to-success/5',
        glow: 'shadow-[0_0_20px_hsl(var(--success)/0.3)]',
        icon: 'text-success',
    },
};

export function EquipmentIcon3D({ Icon, category, size = 'md', className }: EquipmentIcon3DProps) {
    const colors = categoryColors[category];

    return (
        <motion.div
            className={cn(
                'relative flex items-center justify-center rounded-xl',
                'bg-gradient-to-br',
                colors.bg,
                sizeClasses[size],
                className
            )}
            whileHover={{
                scale: 1.05,
                rotateY: 5,
                rotateX: 5,
            }}
            transition={{
                type: 'spring',
                stiffness: 300,
                damping: 20,
            }}
            style={{
                transformStyle: 'preserve-3d',
                perspective: '1000px',
            }}
        >
            {/* Glow effect */}
            <motion.div
                className={cn(
                    'absolute inset-0 rounded-xl blur-md',
                    colors.glow
                )}
                animate={{
                    opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
            />

            {/* Icon */}
            <Icon className={cn(iconSizes[size], colors.icon, 'relative z-10')} />

            {/* 3D depth layer */}
            <div
                className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/10 to-transparent"
                style={{ transform: 'translateZ(-2px)' }}
            />
        </motion.div>
    );
}
