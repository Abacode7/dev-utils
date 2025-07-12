import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';
import { Icons } from '../../styles/icons';

// Security Badge Component
const securityBadgeVariants = cva(
  'inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium',
  {
    variants: {
      variant: {
        secure: 'bg-success-100 text-success-800 border border-success-200',
        verified: 'bg-primary-100 text-primary-800 border border-primary-200',
        encrypted: 'bg-neutral-100 text-neutral-800 border border-neutral-200',
        warning: 'bg-warning-100 text-warning-800 border border-warning-200'
      },
      size: {
        sm: 'px-2 py-1 text-xs',
        md: 'px-3 py-1.5 text-xs',
        lg: 'px-4 py-2 text-sm'
      }
    },
    defaultVariants: {
      variant: 'secure',
      size: 'md'
    }
  }
);

export interface SecurityBadgeProps
  extends VariantProps<typeof securityBadgeVariants> {
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

const SecurityBadge: React.FC<SecurityBadgeProps> = ({
  variant,
  size,
  children,
  icon,
  className
}) => {
  const getDefaultIcon = () => {
    switch (variant) {
      case 'secure':
        return <Icons.Security size={14} />;
      case 'verified':
        return <Icons.Check size={14} />;
      case 'encrypted':
        return <Icons.Key size={14} />;
      case 'warning':
        return <Icons.Alert size={14} />;
      default:
        return <Icons.Security size={14} />;
    }
  };

  return (
    <span className={cn(securityBadgeVariants({ variant, size }), className)}>
      {icon || getDefaultIcon()}
      {children}
    </span>
  );
};

// Trust Indicator Component
export interface TrustIndicatorProps {
  level: 'high' | 'medium' | 'low';
  title: string;
  description?: string;
  features?: string[];
  className?: string;
}

const TrustIndicator: React.FC<TrustIndicatorProps> = ({
  level,
  title,
  description,
  features = [],
  className
}) => {
  const getConfig = () => {
    switch (level) {
      case 'high':
        return {
          color: 'text-success-600',
          bgColor: 'bg-success-50',
          borderColor: 'border-success-200',
          icon: <Icons.Security size={20} />
        };
      case 'medium':
        return {
          color: 'text-warning-600',
          bgColor: 'bg-warning-50',
          borderColor: 'border-warning-200',
          icon: <Icons.Warning size={20} />
        };
      case 'low':
        return {
          color: 'text-error-600',
          bgColor: 'bg-error-50',
          borderColor: 'border-error-200',
          icon: <Icons.Alert size={20} />
        };
    }
  };

  const config = getConfig();

  return (
    <div className={cn(
      'p-4 rounded-lg border',
      config.bgColor,
      config.borderColor,
      className
    )}>
      <div className="flex items-start space-x-3">
        <div className={config.color}>
          {config.icon}
        </div>
        <div className="flex-1">
          <h4 className={cn('font-medium mb-1', config.color)}>
            {title}
          </h4>
          {description && (
            <p className="text-sm text-text-secondary mb-3">
              {description}
            </p>
          )}
          {features.length > 0 && (
            <ul className="space-y-1">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center text-sm text-text-secondary">
                  <Icons.Check size={14} className={cn('mr-2', config.color)} />
                  {feature}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

// Verification Status Component
export interface VerificationStatusProps {
  status: 'verified' | 'pending' | 'failed';
  entity: string;
  timestamp?: Date;
  details?: string;
  className?: string;
}

const VerificationStatus: React.FC<VerificationStatusProps> = ({
  status,
  entity,
  timestamp,
  details,
  className
}) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'verified':
        return {
          icon: <Icons.Check size={16} />,
          color: 'text-success-600',
          bgColor: 'bg-success-100',
          label: 'Verified'
        };
      case 'pending':
        return {
          icon: <Icons.Loading size={16} className="animate-spin" />,
          color: 'text-warning-600',
          bgColor: 'bg-warning-100',
          label: 'Pending'
        };
      case 'failed':
        return {
          icon: <Icons.X size={16} />,
          color: 'text-error-600',
          bgColor: 'bg-error-100',
          label: 'Failed'
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div className={cn('flex items-center space-x-3', className)}>
      <div className={cn(
        'flex items-center justify-center w-8 h-8 rounded-full',
        config.bgColor
      )}>
        <span className={config.color}>
          {config.icon}
        </span>
      </div>
      <div className="flex-1">
        <div className="flex items-center space-x-2">
          <span className="font-medium text-text-primary">{entity}</span>
          <span className={cn('text-sm font-medium', config.color)}>
            {config.label}
          </span>
        </div>
        {(timestamp || details) && (
          <div className="text-xs text-text-tertiary mt-0.5">
            {details && <span>{details}</span>}
            {timestamp && details && <span> • </span>}
            {timestamp && <span>{timestamp.toLocaleDateString()}</span>}
          </div>
        )}
      </div>
    </div>
  );
};

// Security Notice Component
export interface SecurityNoticeProps {
  type: 'info' | 'warning' | 'critical';
  title: string;
  message: string;
  actions?: Array<{
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary';
  }>;
  dismissible?: boolean;
  onDismiss?: () => void;
  className?: string;
}

const SecurityNotice: React.FC<SecurityNoticeProps> = ({
  type,
  title,
  message,
  actions = [],
  dismissible = false,
  onDismiss,
  className
}) => {
  const getTypeConfig = () => {
    switch (type) {
      case 'info':
        return {
          icon: <Icons.Info size={20} />,
          bgColor: 'bg-primary-50',
          borderColor: 'border-primary-200',
          iconColor: 'text-primary-500',
          titleColor: 'text-primary-900'
        };
      case 'warning':
        return {
          icon: <Icons.Warning size={20} />,
          bgColor: 'bg-warning-50',
          borderColor: 'border-warning-200',
          iconColor: 'text-warning-500',
          titleColor: 'text-warning-900'
        };
      case 'critical':
        return {
          icon: <Icons.Alert size={20} />,
          bgColor: 'bg-error-50',
          borderColor: 'border-error-200',
          iconColor: 'text-error-500',
          titleColor: 'text-error-900'
        };
    }
  };

  const config = getTypeConfig();

  return (
    <div className={cn(
      'relative p-4 rounded-lg border',
      config.bgColor,
      config.borderColor,
      className
    )}>
      <div className="flex items-start space-x-3">
        <div className={config.iconColor}>
          {config.icon}
        </div>
        <div className="flex-1">
          <h4 className={cn('font-semibold mb-1', config.titleColor)}>
            {title}
          </h4>
          <p className="text-sm text-text-secondary mb-3">
            {message}
          </p>
          {actions.length > 0 && (
            <div className="flex space-x-3">
              {actions.map((action, index) => (
                <button
                  key={index}
                  onClick={action.onClick}
                  className={cn(
                    'text-sm font-medium transition-colors',
                    action.variant === 'primary' 
                      ? cn('text-primary-600 hover:text-primary-800')
                      : 'text-text-secondary hover:text-text-primary'
                  )}
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}
        </div>
        {dismissible && (
          <button
            onClick={onDismiss}
            className="text-text-tertiary hover:text-text-secondary transition-colors"
            aria-label="Dismiss"
          >
            <Icons.X size={16} />
          </button>
        )}
      </div>
    </div>
  );
};

// Privacy Indicator Component
export interface PrivacyIndicatorProps {
  level: 'public' | 'private' | 'confidential';
  className?: string;
}

const PrivacyIndicator: React.FC<PrivacyIndicatorProps> = ({
  level,
  className
}) => {
  const getConfig = () => {
    switch (level) {
      case 'public':
        return {
          icon: <Icons.Globe size={14} />,
          label: 'Public',
          color: 'text-neutral-600',
          bgColor: 'bg-neutral-100'
        };
      case 'private':
        return {
          icon: <Icons.Lock size={14} />,
          label: 'Private',
          color: 'text-warning-600',
          bgColor: 'bg-warning-100'
        };
      case 'confidential':
        return {
          icon: <Icons.Security size={14} />,
          label: 'Confidential',
          color: 'text-error-600',
          bgColor: 'bg-error-100'
        };
    }
  };

  const config = getConfig();

  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium',
      config.color,
      config.bgColor,
      className
    )}>
      {config.icon}
      {config.label}
    </span>
  );
};

// Compliance Badge Component
export interface ComplianceBadgeProps {
  standards: Array<'SOC2' | 'GDPR' | 'HIPAA' | 'PCI' | 'ISO27001'>;
  className?: string;
}

const ComplianceBadge: React.FC<ComplianceBadgeProps> = ({
  standards,
  className
}) => {
  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {standards.map((standard) => (
        <SecurityBadge
          key={standard}
          variant="verified"
          size="sm"
          icon={<Icons.Quality size={12} />}
        >
          {standard} Compliant
        </SecurityBadge>
      ))}
    </div>
  );
};

export {
  SecurityBadge,
  TrustIndicator,
  VerificationStatus,
  SecurityNotice,
  PrivacyIndicator,
  ComplianceBadge,
  securityBadgeVariants
};