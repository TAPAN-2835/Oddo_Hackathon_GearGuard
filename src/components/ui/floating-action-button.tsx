import { motion } from 'framer-motion';
import { Plus, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './button';

interface FloatingActionButtonProps {
    Icon?: LucideIcon;
    onClick?: () => void;
    label?: string;
    className?: string;
}

export function FloatingActionButton({
    Icon = Plus,
    onClick,
    label = 'Add',
    className,
}: FloatingActionButtonProps) {
    return (
        <motion.div
            className={cn('fixed bottom-8 right-8 z-50', className)}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
        >
            <Button
                onClick={onClick}
                size="lg"
                className="h-14 w-14 rounded-full bg-primary hover:bg-primary/90 shadow-2xl hover:shadow-[0_20px_40px_hsl(var(--primary)/0.4)] transition-all group relative overflow-hidden"
            >
                {/* Ripple effect */}
                <motion.div
                    className="absolute inset-0 bg-white/20 rounded-full"
                    initial={{ scale: 0, opacity: 0.5 }}
                    whileHover={{ scale: 2, opacity: 0 }}
                    transition={{ duration: 0.6 }}
                />

                <Icon className="w-6 h-6 text-primary-foreground relative z-10" />

                {/* Tooltip */}
                <motion.div
                    className="absolute right-full mr-4 px-3 py-1.5 bg-card text-card-foreground text-sm font-medium rounded-lg shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none"
                    initial={{ x: 10, opacity: 0 }}
                    whileHover={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.2 }}
                >
                    {label}
                </motion.div>
            </Button>
        </motion.div>
    );
}
