import { Wrench, Cpu, Truck, Printer, Factory, Monitor, HardDrive, Settings } from 'lucide-react';

interface EquipmentIconProps {
  category: string;
  name?: string;
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

// Get specific icon based on equipment name
const getEquipmentIcon = (category: string, name?: string) => {
  const nameLower = name?.toLowerCase() || '';

  if (nameLower.includes('cnc') || nameLower.includes('lathe')) return Factory;
  if (nameLower.includes('printer') || nameLower.includes('print')) return Printer;
  if (nameLower.includes('laptop') || nameLower.includes('computer') || nameLower.includes('workstation')) return Monitor;
  if (nameLower.includes('server')) return HardDrive;
  if (category === 'IT') return Cpu;
  if (category === 'Vehicle') return Truck;
  if (category === 'Machine') return Settings;

  return Wrench;
};

export function EquipmentIcon({ category, name, size = 'md', className = '' }: EquipmentIconProps) {
  const Icon = getEquipmentIcon(category, name);

  /* eslint-disable @typescript-eslint/no-unused-vars */
  const categoryColors: Record<string, any> = {
    Machine: {
      bg: 'bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5',
      icon: 'text-primary',
      shadow: 'shadow-[0_8px_24px_hsl(239_84%_67%/0.2)]',
      glow: 'after:bg-primary/10',
    },
    Mechanical: {
      bg: 'bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5',
      icon: 'text-primary',
      shadow: 'shadow-[0_8px_24px_hsl(239_84%_67%/0.2)]',
      glow: 'after:bg-primary/10',
    },
    IT: {
      bg: 'bg-gradient-to-br from-info/20 via-info/10 to-info/5',
      icon: 'text-info',
      shadow: 'shadow-[0_8px_24px_hsl(217_91%_60%/0.2)]',
      glow: 'after:bg-info/10',
    },
    Electrical: {
      bg: 'bg-gradient-to-br from-warning/20 via-warning/10 to-warning/5',
      icon: 'text-warning',
      shadow: 'shadow-[0_8px_24px_hsl(38_92%_50%/0.2)]',
      glow: 'after:bg-warning/10',
    },
    Vehicle: {
      bg: 'bg-gradient-to-br from-warning/20 via-warning/10 to-warning/5',
      icon: 'text-warning',
      shadow: 'shadow-[0_8px_24px_hsl(38_92%_50%/0.2)]',
      glow: 'after:bg-warning/10',
    },
    Hydraulic: {
      bg: 'bg-gradient-to-br from-success/20 via-success/10 to-success/5',
      icon: 'text-success',
      shadow: 'shadow-[0_8px_24px_hsl(142_71%_45%/0.2)]',
      glow: 'after:bg-success/10',
    },
    Pneumatic: {
      bg: 'bg-gradient-to-br from-destructive/20 via-destructive/10 to-destructive/5',
      icon: 'text-destructive',
      shadow: 'shadow-[0_8px_24px_hsl(0_84%_60%/0.2)]',
      glow: 'after:bg-destructive/10',
    },
  };

  // Fallback for unknown categories
  const colors = categoryColors[category] || categoryColors['Machine'];

  return (
    <div
      className={`
        ${sizeClasses[size]} 
        ${colors.bg} 
        ${colors.shadow}
        rounded-2xl 
        flex items-center justify-center 
        relative
        transition-all duration-300
        hover:scale-105
        group
        ${className}
      `}
      style={{
        transform: 'perspective(500px) rotateX(5deg) rotateY(-5deg)',
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Inner highlight */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/30 to-transparent pointer-events-none" />

      {/* Bottom shadow for 3D effect */}
      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3/4 h-2 bg-gradient-to-r from-transparent via-foreground/5 to-transparent blur-sm" />

      <Icon className={`${iconSizes[size]} ${colors.icon} relative z-10 drop-shadow-sm group-hover:scale-110 transition-transform`} />
    </div>
  );
}
