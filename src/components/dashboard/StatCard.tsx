import { ReactNode, useEffect, useState } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { Card } from '@/components/ui/card';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: {
    value: string;
    positive: boolean;
  };
  color?: 'primary' | 'success' | 'warning' | 'destructive';
}

const colorClasses = {
  primary: 'bg-primary/10 text-primary',
  success: 'bg-success/10 text-success',
  warning: 'bg-warning/10 text-warning',
  destructive: 'bg-destructive/10 text-destructive',
};

const iconGlowColors = {
  primary: 'shadow-[0_4px_20px_hsl(239_84%_67%/0.25)]',
  success: 'shadow-[0_4px_20px_hsl(160_84%_39%/0.25)]',
  warning: 'shadow-[0_4px_20px_hsl(38_92%_50%/0.25)]',
  destructive: 'shadow-[0_4px_20px_hsl(0_84%_60%/0.25)]',
};

const gradientOverlays = {
  primary: 'from-primary/5 via-transparent to-transparent',
  success: 'from-success/5 via-transparent to-transparent',
  warning: 'from-warning/5 via-transparent to-transparent',
  destructive: 'from-destructive/5 via-transparent to-transparent',
};

export function StatCard({ title, value, icon, trend, color = 'primary' }: StatCardProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const numericValue = typeof value === 'number' ? value : parseInt(value) || 0;

  useEffect(() => {
    if (typeof value === 'number') {
      const controls = animate(0, value, {
        duration: 1,
        onUpdate: (v) => setDisplayValue(Math.round(v)),
      });
      return controls.stop;
    }
  }, [value]);

  return (
    <motion.div
      className="h-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{
        y: -8,
        transition: { duration: 0.3 },
      }}
    >
      <Card className="h-full p-6 bg-card border-0 overflow-hidden relative group shadow-card hover:shadow-card-float transition-shadow duration-300">
        {/* Animated gradient overlay */}
        <motion.div
          className={`absolute inset-0 bg-gradient-to-br ${gradientOverlays[color]} pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
        />

        {/* Glow effect */}
        <motion.div
          className={`absolute -inset-1 ${iconGlowColors[color]} opacity-0 group-hover:opacity-50 blur-xl transition-opacity duration-300`}
        />

        <div className="flex items-start justify-between relative z-10">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <motion.p
              className="text-4xl font-bold text-foreground mt-2 tracking-tight"
              key={displayValue}
            >
              {typeof value === 'number' ? displayValue : value}
            </motion.p>
            {trend && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className={`inline-flex items-center gap-1 mt-3 px-2 py-1 rounded-full text-sm font-medium badge-3d ${trend.positive
                  ? 'bg-success/10 text-success'
                  : 'bg-destructive/10 text-destructive'
                  }`}
              >
                <span className="text-base">{trend.positive ? '↑' : '↓'}</span>
                {trend.value}
              </motion.div>
            )}
          </div>

          {/* Icon with 3D effect */}
          <motion.div
            className={`p-4 rounded-2xl ${colorClasses[color]} ${iconGlowColors[color]}`}
            whileHover={{
              scale: 1.1,
              rotateY: 10,
              rotateX: 10,
            }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 20,
            }}
            style={{
              transformStyle: 'preserve-3d',
            }}
          >
            {icon}
          </motion.div>
        </div>
      </Card>
    </motion.div>
  );
}
