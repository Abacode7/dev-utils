import React from 'react';
import { Icons } from '../styles/icons';

interface Step {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'current' | 'completed' | 'error';
  optional?: boolean;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: string;
  onStepClick?: (stepId: string) => void;
  orientation?: 'horizontal' | 'vertical';
  size?: 'sm' | 'md' | 'lg';
  showConnectors?: boolean;
  className?: string;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({
  steps,
  currentStep,
  onStepClick,
  orientation = 'horizontal',
  size = 'md',
  showConnectors = true,
  className = '',
}) => {
  const currentIndex = steps.findIndex(step => step.id === currentStep);

  const sizeClasses = {
    sm: {
      circle: 'w-6 h-6',
      icon: 12,
      title: 'text-xs',
      description: 'text-xs',
      spacing: orientation === 'horizontal' ? 'space-x-4' : 'space-y-3',
    },
    md: {
      circle: 'w-8 h-8',
      icon: 16,
      title: 'text-sm',
      description: 'text-xs',
      spacing: orientation === 'horizontal' ? 'space-x-6' : 'space-y-4',
    },
    lg: {
      circle: 'w-10 h-10',
      icon: 20,
      title: 'text-base',
      description: 'text-sm',
      spacing: orientation === 'horizontal' ? 'space-x-8' : 'space-y-6',
    },
  };

  const getStepIcon = (step: Step, index: number) => {
    const iconProps = { size: sizeClasses[size].icon };
    
    switch (step.status) {
      case 'completed':
        return <Icons.Check {...iconProps} className="text-white animate-scale-in" />;
      case 'error':
        return <Icons.X {...iconProps} className="text-white animate-bounce-in" />;
      case 'current':
        return <Icons.Play {...iconProps} className="text-white animate-glow-pulse" />;
      default:
        return (
          <span className="text-text-tertiary font-medium transition-colors duration-200">
            {index + 1}
          </span>
        );
    }
  };

  const getStepColors = (step: Step, index: number) => {
    const isClickable = onStepClick && (step.status === 'completed' || index <= currentIndex);
    
    switch (step.status) {
      case 'completed':
        return {
          circle: 'bg-success-500 border-success-500',
          title: 'text-text-primary',
          description: 'text-text-secondary',
          connector: 'bg-success-200',
          clickable: isClickable,
        };
      case 'current':
        return {
          circle: 'bg-primary-500 border-primary-500 ring-4 ring-primary-100 animate-glow-pulse',
          title: 'text-primary-600 font-semibold',
          description: 'text-text-secondary',
          connector: 'bg-border-primary',
          clickable: isClickable,
        };
      case 'error':
        return {
          circle: 'bg-error-500 border-error-500',
          title: 'text-error-600',
          description: 'text-text-secondary',
          connector: 'bg-error-200',
          clickable: isClickable,
        };
      default:
        return {
          circle: 'bg-surface-primary border-border-primary',
          title: 'text-text-tertiary',
          description: 'text-text-tertiary',
          connector: 'bg-border-primary',
          clickable: isClickable,
        };
    }
  };

  const handleStepClick = (step: Step, index: number) => {
    if (onStepClick) {
      const colors = getStepColors(step, index);
      if (colors.clickable) {
        onStepClick(step.id);
      }
    }
  };

  if (orientation === 'vertical') {
    return (
      <div className={`flex flex-col ${className}`}>
        {steps.map((step, index) => {
          const colors = getStepColors(step, index);
          const isLast = index === steps.length - 1;

          return (
            <div key={step.id} className="relative">
              <div
                className={`
                  flex items-start ${sizeClasses[size].spacing}
                  ${colors.clickable ? 'cursor-pointer group' : ''}
                `}
                onClick={() => handleStepClick(step, index)}
              >
                {/* Step Circle */}
                <div className="relative flex-shrink-0">
                  <div
                    className={`
                      ${sizeClasses[size].circle}
                      flex items-center justify-center rounded-full border-2 transition-all duration-200
                      ${colors.circle}
                      ${colors.clickable ? 'group-hover:scale-105' : ''}
                    `}
                  >
                    {getStepIcon(step, index)}
                  </div>
                  
                  {/* Connector Line */}
                  {!isLast && showConnectors && (
                    <div
                      className={`
                        absolute left-1/2 top-full w-0.5 h-6 -translate-x-0.5 transition-colors
                        ${colors.connector}
                      `}
                    />
                  )}
                </div>

                {/* Step Content */}
                <div className="flex-1 min-w-0 pb-6">
                  <div className="flex items-center space-x-2">
                    <h3
                      className={`
                        ${sizeClasses[size].title} font-medium transition-colors
                        ${colors.title}
                        ${colors.clickable ? 'group-hover:text-primary-600' : ''}
                      `}
                    >
                      {step.title}
                    </h3>
                    {step.optional && (
                      <span className="px-2 py-0.5 text-xs font-medium text-text-tertiary bg-surface-secondary rounded-full">
                        Optional
                      </span>
                    )}
                  </div>
                  {step.description && (
                    <p className={`mt-1 ${sizeClasses[size].description} ${colors.description}`}>
                      {step.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // Horizontal orientation
  return (
    <div className={`flex items-center ${className}`}>
      {steps.map((step, index) => {
        const colors = getStepColors(step, index);
        const isLast = index === steps.length - 1;

        return (
          <React.Fragment key={step.id}>
            <div
              className={`
                flex flex-col items-center text-center
                ${colors.clickable ? 'cursor-pointer group' : ''}
              `}
              onClick={() => handleStepClick(step, index)}
            >
              {/* Step Circle */}
              <div
                className={`
                  ${sizeClasses[size].circle}
                  flex items-center justify-center rounded-full border-2 transition-all duration-200
                  ${colors.circle}
                  ${colors.clickable ? 'group-hover:scale-105' : ''}
                `}
              >
                {getStepIcon(step, index)}
              </div>

              {/* Step Content */}
              <div className="mt-2 max-w-24">
                <div className="flex items-center justify-center space-x-1">
                  <h3
                    className={`
                      ${sizeClasses[size].title} font-medium transition-colors truncate
                      ${colors.title}
                      ${colors.clickable ? 'group-hover:text-primary-600' : ''}
                    `}
                  >
                    {step.title}
                  </h3>
                  {step.optional && (
                    <span className="w-1 h-1 bg-text-tertiary rounded-full flex-shrink-0"></span>
                  )}
                </div>
                {step.description && (
                  <p className={`mt-1 ${sizeClasses[size].description} ${colors.description} line-clamp-2`}>
                    {step.description}
                  </p>
                )}
              </div>
            </div>

            {/* Connector Line */}
            {!isLast && showConnectors && (
              <div
                className={`
                  flex-1 h-0.5 mx-4 transition-colors
                  ${colors.connector}
                `}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default StepIndicator;