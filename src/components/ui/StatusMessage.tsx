import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';
import { Icons } from '../../styles/icons';

const statusMessageVariants = cva(
  [
    'flex items-start gap-3 p-4 rounded-lg border',
    'transition-all duration-300 ease-out',
    'animate-scale-in'
  ],
  {
    variants: {
      variant: {
        success: [
          'bg-success-50 border-success-200 text-success-800',
          'dark:bg-success-900/20 dark:border-success-800/30 dark:text-success-200'
        ],
        error: [
          'bg-error-50 border-error-200 text-error-800',
          'dark:bg-error-900/20 dark:border-error-800/30 dark:text-error-200'
        ],
        warning: [
          'bg-warning-50 border-warning-200 text-warning-800',
          'dark:bg-warning-900/20 dark:border-warning-800/30 dark:text-warning-200'
        ],
        info: [
          'bg-primary-50 border-primary-200 text-primary-800',
          'dark:bg-primary-900/20 dark:border-primary-800/30 dark:text-primary-200'
        ],
        neutral: [
          'bg-neutral-50 border-neutral-200 text-neutral-800',
          'dark:bg-neutral-900/20 dark:border-neutral-800/30 dark:text-neutral-200'
        ]
      },
      size: {
        sm: 'text-sm p-3',
        md: 'text-base p-4',
        lg: 'text-lg p-5'
      },
      withIcon: {
        true: '',
        false: 'pl-4'
      },
      dismissible: {
        true: 'pr-10 relative',
        false: ''
      }
    },
    defaultVariants: {
      variant: 'info',
      size: 'md',
      withIcon: true,
      dismissible: false
    }
  }
);

const iconVariants = cva('flex-shrink-0 mt-0.5', {
  variants: {
    variant: {
      success: 'text-success-500',
      error: 'text-error-500',
      warning: 'text-warning-500',
      info: 'text-primary-500',
      neutral: 'text-neutral-500'
    },
    size: {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6'
    }
  },
  defaultVariants: {
    variant: 'info',
    size: 'md'
  }
});

export interface StatusMessageProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statusMessageVariants> {
  title?: string;
  children: React.ReactNode;
  onDismiss?: () => void;
  icon?: React.ReactNode;
}

const StatusMessage = React.forwardRef<HTMLDivElement, StatusMessageProps>(
  ({ 
    className, 
    variant, 
    size, 
    withIcon, 
    dismissible,
    title, 
    children, 
    onDismiss,
    icon,
    ...props 
  }, ref) => {
    const shouldShowIcon = withIcon !== false;
    const canDismiss = dismissible || !!onDismiss;

    const getDefaultIcon = () => {
      switch (variant) {
        case 'success':
          return <Icons.Check className={iconVariants({ variant, size })} />;
        case 'error':
          return <Icons.X className={iconVariants({ variant, size })} />;
        case 'warning':
          return <Icons.Alert className={iconVariants({ variant, size })} />;
        case 'info':
          return <Icons.Info className={iconVariants({ variant, size })} />;
        default:
          return <Icons.Info className={iconVariants({ variant, size })} />;
      }
    };

    return (
      <div
        ref={ref}
        className={cn(
          statusMessageVariants({ 
            variant, 
            size, 
            withIcon: shouldShowIcon, 
            dismissible: canDismiss 
          }),
          className
        )}
        role="alert"
        {...props}
      >
        {/* Icon */}
        {shouldShowIcon && (icon || getDefaultIcon())}
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          {title && (
            <h4 className="font-semibold mb-1 text-current">
              {title}
            </h4>
          )}
          <div className="text-current">
            {children}
          </div>
        </div>
        
        {/* Dismiss Button */}
        {canDismiss && (
          <button
            onClick={onDismiss}
            className="absolute top-2 right-2 p-1 rounded-md hover:bg-black/10 transition-colors focus:outline-none focus:ring-2 focus:ring-current focus:ring-offset-2"
            aria-label="Dismiss"
          >
            <Icons.X className="w-4 h-4" />
          </button>
        )}
      </div>
    );
  }
);

StatusMessage.displayName = 'StatusMessage';

// Convenience components for each variant
export const SuccessMessage = React.forwardRef<HTMLDivElement, Omit<StatusMessageProps, 'variant'>>(
  (props, ref) => <StatusMessage ref={ref} variant="success" {...props} />
);

export const ErrorMessage = React.forwardRef<HTMLDivElement, Omit<StatusMessageProps, 'variant'>>(
  (props, ref) => <StatusMessage ref={ref} variant="error" {...props} />
);

export const WarningMessage = React.forwardRef<HTMLDivElement, Omit<StatusMessageProps, 'variant'>>(
  (props, ref) => <StatusMessage ref={ref} variant="warning" {...props} />
);

export const InfoMessage = React.forwardRef<HTMLDivElement, Omit<StatusMessageProps, 'variant'>>(
  (props, ref) => <StatusMessage ref={ref} variant="info" {...props} />
);

// Toast-style notification
export interface ToastProps extends StatusMessageProps {
  duration?: number;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
}

const toastPositions = {
  'top-right': 'fixed top-4 right-4 z-50',
  'top-left': 'fixed top-4 left-4 z-50',
  'bottom-right': 'fixed bottom-4 right-4 z-50',
  'bottom-left': 'fixed bottom-4 left-4 z-50',
  'top-center': 'fixed top-4 left-1/2 transform -translate-x-1/2 z-50',
  'bottom-center': 'fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50'
};

const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  ({ 
    position = 'top-right',
    duration = 5000,
    onDismiss,
    className,
    ...props 
  }, ref) => {
    const [isVisible, setIsVisible] = React.useState(true);

    React.useEffect(() => {
      if (duration > 0) {
        const timer = setTimeout(() => {
          setIsVisible(false);
          setTimeout(() => onDismiss?.(), 300);
        }, duration);

        return () => clearTimeout(timer);
      }
    }, [duration, onDismiss]);

    if (!isVisible) return null;

    return (
      <StatusMessage
        ref={ref}
        className={cn(
          toastPositions[position],
          'min-w-80 max-w-md shadow-elevation3',
          isVisible ? 'animate-slide-in-right' : 'animate-fade-out',
          className
        )}
        dismissible
        onDismiss={() => {
          setIsVisible(false);
          setTimeout(() => onDismiss?.(), 300);
        }}
        {...props}
      />
    );
  }
);

Toast.displayName = 'Toast';

// Progress indicator with status
export interface ProgressStatusProps {
  value: number;
  max?: number;
  variant?: 'success' | 'error' | 'warning' | 'info';
  showLabel?: boolean;
  label?: string;
  className?: string;
}

const ProgressStatus = React.forwardRef<HTMLDivElement, ProgressStatusProps>(
  ({ 
    value, 
    max = 100, 
    variant = 'info', 
    showLabel = true, 
    label,
    className 
  }, ref) => {
    const percentage = Math.round((value / max) * 100);
    
    const getProgressColor = () => {
      switch (variant) {
        case 'success':
          return 'bg-success-500';
        case 'error':
          return 'bg-error-500';
        case 'warning':
          return 'bg-warning-500';
        case 'info':
        default:
          return 'bg-primary-500';
      }
    };

    return (
      <div ref={ref} className={cn('space-y-2', className)}>
        {showLabel && (
          <div className="flex justify-between text-sm">
            <span className="text-text-secondary">
              {label || 'Progress'}
            </span>
            <span className="text-text-primary font-medium">
              {percentage}%
            </span>
          </div>
        )}
        <div className="w-full bg-surface-tertiary rounded-full h-2 overflow-hidden">
          <div
            className={cn(
              'h-full transition-all duration-500 ease-out rounded-full',
              getProgressColor()
            )}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  }
);

ProgressStatus.displayName = 'ProgressStatus';

SuccessMessage.displayName = 'SuccessMessage';
ErrorMessage.displayName = 'ErrorMessage';
WarningMessage.displayName = 'WarningMessage';
InfoMessage.displayName = 'InfoMessage';

export { 
  StatusMessage,
  Toast,
  ProgressStatus,
  statusMessageVariants // eslint-disable-line react-refresh/only-export-components
};