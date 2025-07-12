import React, { useState } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';
import { Icons } from '../../styles/icons';

const disclosureVariants = cva(
  'transition-all duration-300 ease-out',
  {
    variants: {
      variant: {
        default: 'border border-border-primary rounded-lg bg-surface-primary',
        ghost: 'bg-transparent',
        card: 'border border-border-primary rounded-xl bg-surface-primary shadow-elevation2'
      },
      size: {
        sm: 'p-3',
        md: 'p-4',
        lg: 'p-6'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'md'
    }
  }
);

const triggerVariants = cva(
  [
    'flex items-center justify-between w-full text-left',
    'transition-all duration-200 ease-out',
    'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
    'group'
  ],
  {
    variants: {
      variant: {
        default: 'hover:bg-surface-secondary rounded-md p-2 -m-2',
        minimal: 'hover:text-primary-600',
        button: 'bg-surface-secondary hover:bg-surface-tertiary rounded-lg px-4 py-3 border border-border-primary'
      }
    },
    defaultVariants: {
      variant: 'default'
    }
  }
);

export interface ProgressiveDisclosureProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onToggle'>,
    VariantProps<typeof disclosureVariants> {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  defaultOpen?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  triggerVariant?: VariantProps<typeof triggerVariants>['variant'];
  onToggle?: (isOpen: boolean) => void;
}

const ProgressiveDisclosure = React.forwardRef<HTMLDivElement, ProgressiveDisclosureProps>(
  ({ 
    className, 
    variant, 
    size,
    title, 
    subtitle,
    icon,
    defaultOpen = false,
    disabled = false,
    children, 
    triggerVariant = 'default',
    onToggle,
    ...props 
  }, ref) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    const handleToggle = () => {
      if (disabled) return;
      const newState = !isOpen;
      setIsOpen(newState);
      onToggle?.(newState);
    };

    return (
      <div
        ref={ref}
        className={cn(disclosureVariants({ variant, size }), className)}
        {...props}
      >
        <button
          className={cn(
            triggerVariants({ variant: triggerVariant }),
            disabled && 'opacity-50 cursor-not-allowed'
          )}
          onClick={handleToggle}
          disabled={disabled}
          aria-expanded={isOpen}
        >
          <div className="flex items-center space-x-3">
            {icon && (
              <div className="text-text-secondary group-hover:text-primary-500 transition-colors">
                {icon}
              </div>
            )}
            <div className="text-left">
              <div className="font-medium text-text-primary group-hover:text-primary-600 transition-colors">
                {title}
              </div>
              {subtitle && (
                <div className="text-sm text-text-tertiary mt-0.5">
                  {subtitle}
                </div>
              )}
            </div>
          </div>
          
          <div className={cn(
            'transition-transform duration-200 text-text-secondary group-hover:text-primary-500',
            isOpen && 'rotate-180'
          )}>
            <Icons.Play size={16} className="rotate-90" />
          </div>
        </button>

        <div className={cn(
          'overflow-hidden transition-all duration-300 ease-out',
          isOpen ? 'opacity-100 max-h-screen mt-4' : 'opacity-0 max-h-0'
        )}>
          <div className="animate-slide-in">
            {children}
          </div>
        </div>
      </div>
    );
  }
);

ProgressiveDisclosure.displayName = 'ProgressiveDisclosure';

// Advanced Options Component
export interface AdvancedOptionsProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
}

const AdvancedOptions = React.forwardRef<HTMLDivElement, AdvancedOptionsProps>(
  ({ children, title = "Advanced Options", subtitle = "Configure additional settings", className }, ref) => {
    return (
      <ProgressiveDisclosure
        ref={ref}
        title={title}
        subtitle={subtitle}
        icon={<Icons.Settings size={18} />}
        variant="card"
        triggerVariant="minimal"
        className={className}
      >
        <div className="space-y-4 pt-2 border-t border-border-primary">
          {children}
        </div>
      </ProgressiveDisclosure>
    );
  }
);

AdvancedOptions.displayName = 'AdvancedOptions';

// Collapsible Section Component
export interface CollapsibleSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  badge?: string;
  className?: string;
}

const CollapsibleSection = React.forwardRef<HTMLDivElement, CollapsibleSectionProps>(
  ({ title, description, children, defaultOpen = false, badge, className }, ref) => {
    return (
      <ProgressiveDisclosure
        ref={ref}
        title={title}
        subtitle={description}
        defaultOpen={defaultOpen}
        variant="ghost"
        triggerVariant="button"
        className={className}
      >
        <div className="mt-4 space-y-4">
          {badge && (
            <div className="flex">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                {badge}
              </span>
            </div>
          )}
          {children}
        </div>
      </ProgressiveDisclosure>
    );
  }
);

CollapsibleSection.displayName = 'CollapsibleSection';

// Feature Toggle Component
export interface FeatureToggleProps {
  title: string;
  description: string;
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  children?: React.ReactNode;
  disabled?: boolean;
}

const FeatureToggle = React.forwardRef<HTMLDivElement, FeatureToggleProps>(
  ({ title, description, enabled, onToggle, children, disabled = false }, ref) => {
    const [isExpanded, setIsExpanded] = useState(enabled);

    const handleToggle = () => {
      if (disabled) return;
      const newState = !enabled;
      onToggle(newState);
      if (newState) {
        setIsExpanded(true);
      }
    };

    return (
      <div ref={ref} className="space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h4 className="text-sm font-medium text-text-primary">{title}</h4>
            <p className="text-sm text-text-secondary mt-1">{description}</p>
          </div>
          <button
            onClick={handleToggle}
            disabled={disabled}
            className={cn(
              'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
              enabled ? 'bg-primary-600' : 'bg-neutral-200',
              disabled && 'opacity-50 cursor-not-allowed'
            )}
            role="switch"
            aria-checked={enabled}
          >
            <span
              className={cn(
                'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                enabled ? 'translate-x-5' : 'translate-x-0'
              )}
            />
          </button>
        </div>

        {children && enabled && (
          <div className={cn(
            'transition-all duration-300 ease-out pl-4 border-l-2 border-primary-200',
            isExpanded ? 'opacity-100 max-h-screen' : 'opacity-0 max-h-0 overflow-hidden'
          )}>
            <div className="animate-slide-in">
              {children}
            </div>
          </div>
        )}
      </div>
    );
  }
);

FeatureToggle.displayName = 'FeatureToggle';

export { 
  ProgressiveDisclosure,
  AdvancedOptions,
  CollapsibleSection,
  FeatureToggle,
  disclosureVariants,
  triggerVariants
};