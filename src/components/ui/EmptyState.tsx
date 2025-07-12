import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';
import { Icons } from '../../styles/icons';
import { Button } from './Button';
import { Heading, Text } from './Typography';

const emptyStateVariants = cva(
  'flex flex-col items-center justify-center text-center p-8',
  {
    variants: {
      size: {
        sm: 'py-6 px-4',
        md: 'py-12 px-8',
        lg: 'py-16 px-12'
      },
      variant: {
        default: 'bg-surface-primary',
        subtle: 'bg-surface-secondary/50',
        bordered: 'border-2 border-dashed border-border-primary rounded-xl bg-surface-secondary/30'
      }
    },
    defaultVariants: {
      size: 'md',
      variant: 'default'
    }
  }
);

export interface EmptyStateProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof emptyStateVariants> {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: 'default' | 'outline' | 'ghost';
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  illustration?: React.ReactNode;
}

const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ 
    className, 
    size, 
    variant,
    icon, 
    title, 
    description, 
    action, 
    secondaryAction,
    illustration,
    ...props 
  }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(emptyStateVariants({ size, variant }), className)}
        {...props}
      >
        {/* Illustration or Icon */}
        {illustration ? (
          <div className="mb-6">
            {illustration}
          </div>
        ) : icon ? (
          <div className="mb-6 p-4 rounded-full bg-surface-tertiary text-text-tertiary">
            {icon}
          </div>
        ) : (
          <div className="mb-6 p-4 rounded-full bg-neutral-100 text-neutral-400">
            <Icons.FileIcon size={48} />
          </div>
        )}

        {/* Content */}
        <div className="max-w-sm mx-auto space-y-4">
          <Heading size="h4" className="text-text-primary">
            {title}
          </Heading>
          
          {description && (
            <Text color="secondary" className="leading-relaxed">
              {description}
            </Text>
          )}
        </div>

        {/* Actions */}
        {(action || secondaryAction) && (
          <div className="mt-8 flex flex-col sm:flex-row gap-3 items-center">
            {action && (
              <Button
                variant={action.variant || 'default'}
                onClick={action.onClick}
                className="w-full sm:w-auto"
              >
                {action.label}
              </Button>
            )}
            {secondaryAction && (
              <Button
                variant="ghost"
                onClick={secondaryAction.onClick}
                className="w-full sm:w-auto"
              >
                {secondaryAction.label}
              </Button>
            )}
          </div>
        )}
      </div>
    );
  }
);

EmptyState.displayName = 'EmptyState';

// Specific Empty State Components
export const NoDataState: React.FC<{
  title?: string;
  description?: string;
  onRefresh?: () => void;
  className?: string;
}> = ({ 
  title = "No data available", 
  description = "There's no data to display at the moment.", 
  onRefresh,
  className 
}) => (
  <EmptyState
    icon={<Icons.Analytics size={48} />}
    title={title}
    description={description}
    action={onRefresh ? { label: "Refresh", onClick: onRefresh } : undefined}
    variant="subtle"
    className={className}
  />
);

export const NoResultsState: React.FC<{
  searchTerm?: string;
  onClear?: () => void;
  className?: string;
}> = ({ searchTerm, onClear, className }) => (
  <EmptyState
    icon={<Icons.Search size={48} />}
    title="No results found"
    description={
      searchTerm 
        ? `No results found for "${searchTerm}". Try adjusting your search.`
        : "No results match your current filters."
    }
    action={onClear ? { label: "Clear search", onClick: onClear, variant: "outline" } : undefined}
    variant="subtle"
    className={className}
  />
);

export const ErrorState: React.FC<{
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}> = ({ 
  title = "Something went wrong", 
  description = "We encountered an error while loading this content.", 
  onRetry,
  className 
}) => (
  <EmptyState
    icon={<Icons.Error size={48} className="text-error-500" />}
    title={title}
    description={description}
    action={onRetry ? { label: "Try again", onClick: onRetry } : undefined}
    variant="subtle"
    className={className}
  />
);

export const LoadingState: React.FC<{
  title?: string;
  description?: string;
  className?: string;
}> = ({ 
  title = "Loading...", 
  description = "Please wait while we load your content.", 
  className 
}) => (
  <EmptyState
    icon={<Icons.Loading size={48} className="animate-spin text-primary-500" />}
    title={title}
    description={description}
    variant="subtle"
    className={className}
  />
);

export const WelcomeState: React.FC<{
  title: string;
  description: string;
  onGetStarted: () => void;
  features?: string[];
  className?: string;
}> = ({ title, description, onGetStarted, features = [], className }) => (
  <EmptyState
    icon={<Icons.Brand size={64} className="text-primary-500" />}
    title={title}
    description={description}
    action={{ label: "Get Started", onClick: onGetStarted }}
    variant="bordered"
    size="lg"
    className={className}
  >
    {features.length > 0 && (
      <div className="mt-6 space-y-2">
        {features.map((feature, index) => (
          <div key={index} className="flex items-center text-sm text-text-secondary">
            <Icons.Check size={16} className="text-success-500 mr-2" />
            {feature}
          </div>
        ))}
      </div>
    )}
  </EmptyState>
);

// Workflow Step Empty State
export const WorkflowStepState: React.FC<{
  step: number;
  totalSteps: number;
  title: string;
  description: string;
  onNext: () => void;
  onBack?: () => void;
  className?: string;
}> = ({ step, totalSteps, title, description, onNext, onBack, className }) => (
  <EmptyState
    icon={
      <div className="relative">
        <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center">
          <span className="text-2xl font-bold text-primary-600">{step}</span>
        </div>
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
          <span className="text-xs text-white font-medium">{totalSteps}</span>
        </div>
      </div>
    }
    title={title}
    description={description}
    action={{ label: "Continue", onClick: onNext }}
    secondaryAction={onBack ? { label: "Back", onClick: onBack } : undefined}
    variant="bordered"
    className={className}
  />
);

export {
  EmptyState,
  emptyStateVariants
};