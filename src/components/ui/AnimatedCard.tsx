import React, { useState } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';

const animatedCardVariants = cva(
  [
    'relative overflow-hidden rounded-xl',
    'bg-white border border-border-primary',
    'transition-all duration-300 ease-out',
    'transform-gpu',
    'group'
  ],
  {
    variants: {
      animation: {
        none: '',
        hover: 'hover:scale-[1.02] hover:-translate-y-1',
        lift: 'hover:scale-105 hover:-translate-y-2',
        glow: 'hover:shadow-glow',
        bounce: 'hover:animate-bounce',
        pulse: 'hover:animate-pulse',
        float: 'animate-float',
        shimmer: 'relative overflow-hidden'
      },
      shadow: {
        none: 'shadow-none',
        sm: 'shadow-sm hover:shadow-md',
        md: 'shadow-md hover:shadow-lg',
        lg: 'shadow-lg hover:shadow-xl',
        xl: 'shadow-xl hover:shadow-2xl',
        glass: 'shadow-glass hover:shadow-glassLg',
        glow: 'shadow-glow'
      },
      border: {
        none: 'border-none',
        subtle: 'border border-border-primary',
        accent: 'border border-primary-200 hover:border-primary-300',
        gradient: 'border-2 border-transparent bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-padding'
      }
    },
    defaultVariants: {
      animation: 'hover',
      shadow: 'md',
      border: 'subtle'
    }
  }
);

export interface AnimatedCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof animatedCardVariants> {
  children: React.ReactNode;
  withLoadingState?: boolean;
  isLoading?: boolean;
  withRipple?: boolean;
}

const AnimatedCard = React.forwardRef<HTMLDivElement, AnimatedCardProps>(
  ({ 
    className, 
    animation, 
    shadow, 
    border,
    withLoadingState = false,
    isLoading = false,
    withRipple = false,
    children, 
    ...props 
  }, ref) => {
    const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);

    const createRipple = (event: React.MouseEvent<HTMLDivElement>) => {
      if (!withRipple) return;
      
      const rect = event.currentTarget.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      
      const newRipple = {
        id: Date.now(),
        x,
        y
      };
      
      setRipples(prev => [...prev, newRipple]);
      
      setTimeout(() => {
        setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
      }, 600);
    };

    return (
      <div
        ref={ref}
        className={cn(
          animatedCardVariants({ animation, shadow, border }),
          isLoading && 'pointer-events-none opacity-70',
          className
        )}
        onClick={createRipple}
        {...props}
      >
        {/* Loading State */}
        {withLoadingState && isLoading && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -skew-x-12 animate-shimmer" />
        )}
        
        {/* Shimmer Effect for shimmer animation */}
        {animation === 'shimmer' && (
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 animate-shimmer" />
          </div>
        )}
        
        {/* Ripple Effects */}
        {withRipple && ripples.map((ripple) => (
          <div
            key={ripple.id}
            className="absolute pointer-events-none"
            style={{
              left: ripple.x - 25,
              top: ripple.y - 25,
            }}
          >
            <div className="w-12 h-12 bg-primary-500/30 rounded-full animate-ripple" />
          </div>
        ))}
        
        {/* Content */}
        <div className="relative z-10">
          {children}
        </div>
        
        {/* Gradient Border Effect */}
        {border === 'gradient' && (
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary-500 to-secondary-500 opacity-75" />
        )}
      </div>
    );
  }
);

AnimatedCard.displayName = 'AnimatedCard';

// Loading Card Component
export interface LoadingCardProps extends React.HTMLAttributes<HTMLDivElement> {
  lines?: number;
  showAvatar?: boolean;
}

const LoadingCard = React.forwardRef<HTMLDivElement, LoadingCardProps>(
  ({ className, lines = 3, showAvatar = false, ...props }, ref) => {
    return (
      <AnimatedCard
        ref={ref}
        className={cn('p-6', className)}
        withLoadingState
        isLoading
        {...props}
      >
        <div className="animate-pulse">
          <div className="flex items-center space-x-4">
            {showAvatar && (
              <div className="rounded-full bg-neutral-200 h-12 w-12" />
            )}
            <div className="flex-1 space-y-3">
              <div className="h-4 bg-neutral-200 rounded-lg w-3/4" />
              {Array.from({ length: lines }).map((_, i) => (
                <div 
                  key={i}
                  className="h-3 bg-neutral-200 rounded-lg"
                  style={{ width: `${Math.random() * 40 + 60}%` }}
                />
              ))}
            </div>
          </div>
        </div>
      </AnimatedCard>
    );
  }
);

LoadingCard.displayName = 'LoadingCard';

// Interactive Card Component with enhanced interactions
export interface InteractiveCardProps extends AnimatedCardProps {
  onCardClick?: () => void;
  isSelected?: boolean;
  isDisabled?: boolean;
}

const InteractiveCard = React.forwardRef<HTMLDivElement, InteractiveCardProps>(
  ({ 
    className, 
    onCardClick,
    isSelected = false,
    isDisabled = false,
    children, 
    ...props 
  }, ref) => {
    return (
      <AnimatedCard
        ref={ref}
        className={cn(
          'cursor-pointer select-none',
          isSelected && 'ring-2 ring-primary-500 shadow-glow',
          isDisabled && 'opacity-50 cursor-not-allowed pointer-events-none',
          className
        )}
        animation="hover"
        withRipple
        onClick={onCardClick}
        {...props}
      >
        {children}
        
        {/* Selection Indicator */}
        {isSelected && (
          <div className="absolute top-2 right-2 w-3 h-3 bg-primary-500 rounded-full shadow-glow animate-pulse" />
        )}
      </AnimatedCard>
    );
  }
);

InteractiveCard.displayName = 'InteractiveCard';

export { 
  AnimatedCard, 
  LoadingCard, 
  InteractiveCard,
  animatedCardVariants // eslint-disable-line react-refresh/only-export-components
};