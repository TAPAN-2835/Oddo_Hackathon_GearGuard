import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface Avatar3DProps {
  initials: string;
  src?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'h-7 w-7 text-xs',
  md: 'h-9 w-9 text-sm',
  lg: 'h-12 w-12 text-base',
};

export function Avatar3D({ initials, src, size = 'md', className }: Avatar3DProps) {
  return (
    <Avatar 
      className={cn(
        sizeClasses[size],
        'avatar-3d ring-2 ring-card',
        'shadow-[0_4px_12px_hsl(224_71%_4%/0.1)]',
        'transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_8px_20px_hsl(224_71%_4%/0.15)]',
        className
      )}
    >
      {src && <AvatarImage src={src} alt={initials} />}
      <AvatarFallback 
        className="bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5 text-primary font-semibold"
        style={{
          textShadow: '0 1px 2px hsl(0 0% 100% / 0.5)',
        }}
      >
        {initials}
      </AvatarFallback>
    </Avatar>
  );
}

interface AvatarStackProps {
  avatars: { initials: string; src?: string }[];
  max?: number;
  size?: 'sm' | 'md' | 'lg';
}

export function AvatarStack({ avatars, max = 3, size = 'sm' }: AvatarStackProps) {
  const visibleAvatars = avatars.slice(0, max);
  const remaining = avatars.length - max;
  
  return (
    <div className="flex -space-x-2">
      {visibleAvatars.map((avatar, index) => (
        <Avatar3D 
          key={index} 
          initials={avatar.initials} 
          src={avatar.src}
          size={size}
          className="hover:z-10"
        />
      ))}
      {remaining > 0 && (
        <div 
          className={cn(
            sizeClasses[size],
            'rounded-full bg-muted flex items-center justify-center font-medium text-muted-foreground',
            'ring-2 ring-card shadow-[0_4px_12px_hsl(224_71%_4%/0.1)]'
          )}
        >
          +{remaining}
        </div>
      )}
    </div>
  );
}
