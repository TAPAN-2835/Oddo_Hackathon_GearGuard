import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface Badge3DProps {
  children: ReactNode;
  variant?: 'new' | 'inProgress' | 'repaired' | 'scrap' | 'preventive' | 'corrective' | 'active' | 'default';
  size?: 'sm' | 'md';
  className?: string;
}

const variantStyles = {
  new: {
    bg: 'bg-gradient-to-b from-info via-info to-info/90',
    text: 'text-info-foreground',
    shadow: 'shadow-[0_2px_8px_hsl(217_91%_60%/0.35),inset_0_1px_0_hsl(0_0%_100%/0.2),inset_0_-1px_2px_hsl(217_91%_40%/0.3)]',
  },
  inProgress: {
    bg: 'bg-gradient-to-b from-warning via-warning to-warning/90',
    text: 'text-warning-foreground',
    shadow: 'shadow-[0_2px_8px_hsl(38_92%_50%/0.35),inset_0_1px_0_hsl(0_0%_100%/0.2),inset_0_-1px_2px_hsl(38_92%_40%/0.3)]',
  },
  repaired: {
    bg: 'bg-gradient-to-b from-success via-success to-success/90',
    text: 'text-success-foreground',
    shadow: 'shadow-[0_2px_8px_hsl(160_84%_39%/0.35),inset_0_1px_0_hsl(0_0%_100%/0.2),inset_0_-1px_2px_hsl(160_84%_30%/0.3)]',
  },
  scrap: {
    bg: 'bg-gradient-to-b from-destructive via-destructive to-destructive/90',
    text: 'text-destructive-foreground',
    shadow: 'shadow-[0_2px_8px_hsl(0_84%_60%/0.35),inset_0_1px_0_hsl(0_0%_100%/0.2),inset_0_-1px_2px_hsl(0_84%_50%/0.3)]',
  },
  preventive: {
    bg: 'bg-gradient-to-b from-primary via-primary to-primary/90',
    text: 'text-primary-foreground',
    shadow: 'shadow-[0_2px_8px_hsl(239_84%_67%/0.35),inset_0_1px_0_hsl(0_0%_100%/0.2),inset_0_-1px_2px_hsl(239_84%_55%/0.3)]',
  },
  corrective: {
    bg: 'bg-gradient-to-b from-warning via-warning to-warning/90',
    text: 'text-warning-foreground',
    shadow: 'shadow-[0_2px_8px_hsl(38_92%_50%/0.35),inset_0_1px_0_hsl(0_0%_100%/0.2),inset_0_-1px_2px_hsl(38_92%_40%/0.3)]',
  },
  active: {
    bg: 'bg-gradient-to-b from-success via-success to-success/90',
    text: 'text-success-foreground',
    shadow: 'shadow-[0_2px_8px_hsl(160_84%_39%/0.35),inset_0_1px_0_hsl(0_0%_100%/0.2),inset_0_-1px_2px_hsl(160_84%_30%/0.3)]',
  },
  default: {
    bg: 'bg-gradient-to-b from-muted via-muted to-muted/90',
    text: 'text-muted-foreground',
    shadow: 'shadow-[0_2px_8px_hsl(220_14%_96%/0.35),inset_0_1px_0_hsl(0_0%_100%/0.2),inset_0_-1px_2px_hsl(220_9%_46%/0.1)]',
  },
};

const sizeStyles = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1 text-sm',
};

export function Badge3D({ children, variant = 'default', size = 'sm', className }: Badge3DProps) {
  const styles = variantStyles[variant];
  
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center font-semibold rounded-full',
        'transition-all duration-200',
        'hover:scale-105',
        styles.bg,
        styles.text,
        styles.shadow,
        sizeStyles[size],
        className
      )}
      style={{
        textShadow: '0 1px 0 hsl(0 0% 100% / 0.1)',
      }}
    >
      {children}
    </span>
  );
}
