interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: string | number;
  height?: string | number;
  lines?: number;
  animation?: 'pulse' | 'wave' | 'none';
}

/**
 * Skeleton Loading Component
 * 
 * Features:
 * - Multiple variants (text, circular, rectangular, rounded)
 * - Pulse or wave animation
 * - Customizable dimensions
 * - Multi-line text support
 * - Accessible (aria-busy)
 * 
 * Usage:
 * <Skeleton variant="text" width={200} />
 * <Skeleton variant="circular" width={40} height={40} />
 * <Skeleton variant="rounded" width="100%" height={200} />
 * <Skeleton lines={3} />
 */
export default function Skeleton({
  className = '',
  variant = 'text',
  width,
  height,
  lines = 1,
  animation = 'pulse',
}: SkeletonProps) {
  const baseClasses = 'bg-gray-200 overflow-hidden relative';
  
  const variantClasses = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: '',
    rounded: 'rounded-lg',
  };

  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'animate-pulse', // CSS wave animation below
    none: '',
  };

  const style: React.CSSProperties = {
    width: width || '100%',
    height: height || (variant === 'text' ? '1rem' : undefined),
  };

  // Multiple lines for text variant
  if (variant === 'text' && lines > 1) {
    return (
      <div 
        className={`${baseClasses} ${animationClasses[animation]} ${className}`.trim()}
        role="status"
        aria-busy="true"
        aria-label="Đang tải..."
      >
        <div className="space-y-2">
          {Array.from({ length: lines }).map((_, i) => (
            <div
              key={i}
              className="rounded bg-gray-200"
              style={{
                width: i === lines - 1 ? '75%' : '100%',
                height: height || '1rem',
              }}
            />
          ))}
        </div>
        <span className="sr-only">Đang tải...</span>
      </div>
    );
  }

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${animationClasses[animation]} ${className}`.trim()}
      style={style}
      role="status"
      aria-busy="true"
      aria-label="Đang tải..."
    >
      <span className="sr-only">Đang tải...</span>
    </div>
  );
}
