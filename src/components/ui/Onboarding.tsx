import React, { useState, useEffect, useCallback } from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../../utils/cn';
import { Icons } from '../../styles/icons';
import { AnimatedCard } from './AnimatedCard';
import { Button } from './Button';

// Onboarding Step Interface
export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  target?: string; // CSS selector for highlighting
  content?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
  skippable?: boolean;
}

// Onboarding Tour Component
export interface OnboardingTourProps {
  steps: OnboardingStep[];
  isActive: boolean;
  onComplete: () => void;
  onSkip: () => void;
  showProgress?: boolean;
  showSkip?: boolean;
  overlayClassName?: string;
}

const OnboardingTour: React.FC<OnboardingTourProps> = ({
  steps,
  isActive,
  onComplete,
  onSkip,
  showProgress = true,
  showSkip = true,
  overlayClassName
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const currentStep = steps[currentStepIndex];
  const isLastStep = currentStepIndex === steps.length - 1;

  useEffect(() => {
    if (isActive) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [isActive]);

  const handleNext = useCallback(() => {
    if (currentStep.action) {
      currentStep.action.onClick();
    }
    
    if (isLastStep) {
      onComplete();
    } else {
      setCurrentStepIndex(prev => prev + 1);
    }
  }, [currentStep, isLastStep, onComplete]);

  const handlePrevious = useCallback(() => {
    setCurrentStepIndex(prev => Math.max(0, prev - 1));
  }, []);

  const handleSkip = useCallback(() => {
    setIsVisible(false);
    onSkip();
  }, [onSkip]);

  if (!isVisible || !currentStep) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Overlay */}
      <div className={cn(
        'absolute inset-0 bg-black/60 backdrop-blur-sm',
        overlayClassName
      )} />
      
      {/* Highlight Target */}
      {currentStep.target && (
        <div 
          className="absolute border-4 border-primary-400 rounded-lg shadow-glow animate-glow-pulse"
          style={{
            // Position will be calculated based on target element
          }}
        />
      )}

      {/* Tour Card */}
      <div className={cn(
        'absolute z-10 w-80 max-w-sm',
        currentStep.position === 'center' && 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2',
        currentStep.position === 'top' && 'top-20 left-1/2 transform -translate-x-1/2',
        currentStep.position === 'bottom' && 'bottom-20 left-1/2 transform -translate-x-1/2',
        currentStep.position === 'left' && 'left-8 top-1/2 transform -translate-y-1/2',
        currentStep.position === 'right' && 'right-8 top-1/2 transform -translate-y-1/2',
        !currentStep.position && 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'
      )}>
        <AnimatedCard
          animation="bounce"
          shadow="xl"
          className="bg-white border border-border-primary"
        >
          <div className="p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-text-primary mb-1">
                  {currentStep.title}
                </h3>
                {showProgress && (
                  <div className="text-xs text-text-tertiary">
                    Step {currentStepIndex + 1} of {steps.length}
                  </div>
                )}
              </div>
              {showSkip && (
                <button
                  onClick={handleSkip}
                  className="text-text-tertiary hover:text-text-secondary transition-colors p-1"
                  aria-label="Skip tour"
                >
                  <Icons.X size={20} />
                </button>
              )}
            </div>

            {/* Content */}
            <div className="mb-6">
              <p className="text-text-secondary mb-4">
                {currentStep.description}
              </p>
              {currentStep.content && (
                <div className="bg-surface-secondary rounded-lg p-3">
                  {currentStep.content}
                </div>
              )}
            </div>

            {/* Progress Bar */}
            {showProgress && (
              <div className="mb-4">
                <div className="w-full bg-surface-tertiary rounded-full h-1">
                  <div 
                    className="bg-primary-500 h-1 rounded-full transition-all duration-500"
                    style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
                  />
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePrevious}
                disabled={currentStepIndex === 0}
              >
                Previous
              </Button>
              
              <div className="flex space-x-2">
                {currentStep.skippable && !isLastStep && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentStepIndex(prev => prev + 1)}
                  >
                    Skip
                  </Button>
                )}
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleNext}
                >
                  {currentStep.action?.label || (isLastStep ? 'Finish' : 'Next')}
                </Button>
              </div>
            </div>
          </div>
        </AnimatedCard>
      </div>
    </div>
  );
};

// Tooltip Component
const tooltipVariants = cva(
  [
    'absolute z-50 px-3 py-2 text-sm',
    'bg-neutral-900 text-white rounded-lg shadow-lg',
    'max-w-xs break-words',
    'animate-scale-in'
  ],
  {
    variants: {
      position: {
        top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
        bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
        left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
        right: 'left-full top-1/2 transform -translate-y-1/2 ml-2'
      }
    },
    defaultVariants: {
      position: 'top'
    }
  }
);

export interface TooltipProps {
  content: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  trigger?: 'hover' | 'click' | 'focus';
  delay?: number;
  children: React.ReactElement;
  className?: string;
  disabled?: boolean;
}

const Tooltip: React.FC<TooltipProps> = ({
  content,
  position = 'top',
  trigger = 'hover',
  delay = 200,
  children,
  className,
  disabled = false
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [timeoutId, setTimeoutId] = useState<ReturnType<typeof setTimeout> | null>(null);

  const showTooltip = useCallback(() => {
    if (disabled) return;
    
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    
    const id = setTimeout(() => {
      setIsVisible(true);
    }, delay);
    
    setTimeoutId(id);
  }, [delay, disabled, timeoutId]);

  const hideTooltip = useCallback(() => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
    setIsVisible(false);
  }, [timeoutId]);

  const toggleTooltip = useCallback(() => {
    if (disabled) return;
    setIsVisible(prev => !prev);
  }, [disabled]);

  const handleMouseEnter = trigger === 'hover' ? showTooltip : undefined;
  const handleMouseLeave = trigger === 'hover' ? hideTooltip : undefined;
  const handleClick = trigger === 'click' ? toggleTooltip : undefined;
  const handleFocus = trigger === 'focus' ? showTooltip : undefined;
  const handleBlur = trigger === 'focus' ? hideTooltip : undefined;

  return (
    <div className="relative inline-block">
      {React.cloneElement(children, {
        ...(handleMouseEnter && { onMouseEnter: handleMouseEnter }),
        ...(handleMouseLeave && { onMouseLeave: handleMouseLeave }),
        ...(handleClick && { onClick: handleClick }),
        ...(handleFocus && { onFocus: handleFocus }),
        ...(handleBlur && { onBlur: handleBlur }),
      })}
      
      {isVisible && (
        <>
          <div className={cn(tooltipVariants({ position }), className)}>
            {content}
            {/* Arrow */}
            <div 
              className={cn(
                'absolute w-2 h-2 bg-neutral-900 transform rotate-45',
                position === 'top' && 'top-full left-1/2 -translate-x-1/2 -mt-1',
                position === 'bottom' && 'bottom-full left-1/2 -translate-x-1/2 -mb-1',
                position === 'left' && 'left-full top-1/2 -translate-y-1/2 -ml-1',
                position === 'right' && 'right-full top-1/2 -translate-y-1/2 -mr-1'
              )}
            />
          </div>
        </>
      )}
    </div>
  );
};

// Welcome Card Component
export interface WelcomeCardProps {
  title: string;
  description: string;
  features?: string[];
  onGetStarted: () => void;
  onSkip?: () => void;
  illustration?: React.ReactNode;
}

const WelcomeCard: React.FC<WelcomeCardProps> = ({
  title,
  description,
  features = [],
  onGetStarted,
  onSkip,
  illustration
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <AnimatedCard
        animation="bounce"
        shadow="xl"
        className="w-full max-w-md mx-4 bg-white"
      >
        <div className="p-8 text-center">
          {illustration && (
            <div className="mb-6 flex justify-center">
              {illustration}
            </div>
          )}
          
          <h2 className="text-2xl font-bold text-text-primary mb-4">
            {title}
          </h2>
          
          <p className="text-text-secondary mb-6">
            {description}
          </p>
          
          {features.length > 0 && (
            <div className="mb-6 space-y-2">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center text-sm text-text-secondary">
                  <Icons.Check size={16} className="text-success-500 mr-2" />
                  {feature}
                </div>
              ))}
            </div>
          )}
          
          <div className="flex space-x-3">
            {onSkip && (
              <Button variant="ghost" onClick={onSkip} className="flex-1">
                Skip
              </Button>
            )}
            <Button onClick={onGetStarted} className="flex-1">
              Get Started
            </Button>
          </div>
        </div>
      </AnimatedCard>
    </div>
  );
};

// Help Button Component
export interface HelpButtonProps {
  tooltip?: string;
  onClick?: () => void;
  className?: string;
}

const HelpButton: React.FC<HelpButtonProps> = ({
  tooltip = "Get help",
  onClick,
  className
}) => {
  const button = (
    <button
      onClick={onClick}
      className={cn(
        'inline-flex items-center justify-center w-5 h-5 rounded-full',
        'bg-neutral-100 hover:bg-neutral-200 text-neutral-600 hover:text-neutral-800',
        'transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500',
        className
      )}
      aria-label={tooltip}
    >
      <Icons.Help size={12} />
    </button>
  );

  if (onClick) {
    return button;
  }

  return (
    <Tooltip content={tooltip} position="top">
      {button}
    </Tooltip>
  );
};

export {
  OnboardingTour,
  Tooltip,
  WelcomeCard,
  HelpButton,
  tooltipVariants
};