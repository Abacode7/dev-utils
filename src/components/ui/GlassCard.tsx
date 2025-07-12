import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';

const glassCardVariants = cva(
  [
    'relative overflow-hidden rounded-xl',
    'backdrop-blur-xl backdrop-saturate-150',
    'border border-white/20',
    'transition-all duration-300 ease-out',
    'group'
  ],
  {
    variants: {
      variant: {
        default: [
          'bg-white/10',
          'hover:bg-white/15',
          'shadow-glass',
          'hover:shadow-glassLg'
        ],
        elevated: [
          'bg-white/15',
          'hover:bg-white/20',
          'shadow-glassLg',
          'hover:shadow-glassXl'
        ],
        premium: [
          'bg-gradient-to-br from-white/20 via-white/10 to-white/5',
          'hover:from-white/25 hover:via-white/15 hover:to-white/10',
          'shadow-glassXl',
          'hover:shadow-elevation5',
          'border-gradient-to-r from-white/30 to-white/10'
        ],
        interactive: [
          'bg-white/10',
          'hover:bg-white/20',
          'hover:scale-[1.02]',
          'hover:-translate-y-1',
          'shadow-glass',
          'hover:shadow-glowLg',
          'cursor-pointer'
        ]
      },
      size: {
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
        xl: 'p-10'
      },
      glow: {
        none: '',
        subtle: 'hover:shadow-glow',
        primary: 'hover:shadow-glow',
        success: 'hover:shadow-glowSuccess',
        warning: 'hover:shadow-glowWarning',
        error: 'hover:shadow-glowError'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
      glow: 'none'
    }
  }
);

export interface GlassCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof glassCardVariants> {
  children: React.ReactNode;
  withAnimation?: boolean;
  withShimmer?: boolean;
}

const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ 
    className, 
    variant, 
    size, 
    glow, 
    withAnimation = true, 
    withShimmer = false,
    children, 
    ...props 
  }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          glassCardVariants({ variant, size, glow }),
          withAnimation && 'transform-gpu',
          className
        )}
        {...props}
      >
        {/* Shimmer Effect */}
        {withShimmer && (
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-shimmer" />
          </div>
        )}
        
        {/* Content */}
        <div className="relative z-10">
          {children}
        </div>
        
        {/* Glow Border Effect */}
        <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary-400/30 via-primary-500/20 to-secondary-400/30 blur-sm" />
        </div>
      </div>
    );
  }
);

GlassCard.displayName = 'GlassCard';

// Glass Card Header Component
export interface GlassCardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const GlassCardHeader = React.forwardRef<HTMLDivElement, GlassCardHeaderProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col space-y-1.5 pb-4 border-b border-white/10',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

GlassCardHeader.displayName = 'GlassCardHeader';

// Glass Card Title Component
export interface GlassCardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
}

const GlassCardTitle = React.forwardRef<HTMLHeadingElement, GlassCardTitleProps>(
  ({ className, children, level = 3, ...props }, ref) => {
    const Component = `h${level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
    
    return (
      <Component
        ref={ref}
        className={cn(
          'font-semibold leading-none tracking-tight',
          'text-white/90 drop-shadow-sm',
          level === 1 && 'text-3xl',
          level === 2 && 'text-2xl',
          level === 3 && 'text-xl',
          level === 4 && 'text-lg',
          level === 5 && 'text-base',
          level === 6 && 'text-sm',
          className
        )}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

GlassCardTitle.displayName = 'GlassCardTitle';

// Glass Card Content Component
export interface GlassCardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const GlassCardContent = React.forwardRef<HTMLDivElement, GlassCardContentProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('pt-4 text-white/80', className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

GlassCardContent.displayName = 'GlassCardContent';

// Glass Card Footer Component
export interface GlassCardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const GlassCardFooter = React.forwardRef<HTMLDivElement, GlassCardFooterProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center pt-4 mt-4 border-t border-white/10',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

GlassCardFooter.displayName = 'GlassCardFooter';

export { 
  GlassCard, 
  GlassCardHeader, 
  GlassCardTitle, 
  GlassCardContent, 
  GlassCardFooter,
  glassCardVariants // eslint-disable-line react-refresh/only-export-components
};