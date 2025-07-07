import React from 'react';
import { cn } from '../utils/cn';

interface SkeletonLoaderProps {
  className?: string;
  variant?: 'text' | 'rectangular' | 'circular';
  width?: string | number;
  height?: string | number;
  lines?: number;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  className,
  variant = 'text',
  width,
  height,
  lines = 1,
}) => {
  const baseClasses = 'animate-pulse bg-neutral-200 dark:bg-neutral-700';
  
  const variantClasses = {
    text: 'rounded',
    rectangular: 'rounded',
    circular: 'rounded-full',
  };

  const getStyle = () => {
    const style: React.CSSProperties = {};
    if (width) style.width = width;
    if (height) style.height = height;
    return style;
  };

  if (variant === 'text' && lines > 1) {
    return (
      <div className={className}>
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={cn(
              baseClasses,
              variantClasses[variant],
              'h-4 mb-2 last:mb-0',
              index === lines - 1 ? 'w-3/4' : 'w-full'
            )}
            style={getStyle()}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(
        baseClasses,
        variantClasses[variant],
        variant === 'text' && 'h-4',
        variant === 'rectangular' && 'h-20',
        variant === 'circular' && 'h-10 w-10',
        className
      )}
      style={getStyle()}
    />
  );
};

export default SkeletonLoader;