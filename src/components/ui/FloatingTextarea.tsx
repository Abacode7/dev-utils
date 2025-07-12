import React, { useState, useRef, useEffect } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';

const floatingTextareaVariants = cva(
  'relative w-full',
  {
    variants: {
      variant: {
        default: '',
        error: '',
        success: '',
        warning: '',
      },
      size: {
        sm: '',
        md: '',
        lg: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

const textareaVariants = cva(
  'peer w-full bg-transparent border-2 rounded-lg outline-none transition-all duration-200 placeholder-transparent resize-none',
  {
    variants: {
      variant: {
        default: 'border-border-primary focus:border-primary-500 text-text-primary',
        error: 'border-error-500 focus:border-error-600 text-text-primary',
        success: 'border-success-500 focus:border-success-600 text-text-primary', 
        warning: 'border-warning-500 focus:border-warning-600 text-text-primary',
      },
      size: {
        sm: 'px-3 py-2 text-sm min-h-[80px]',
        md: 'px-4 py-3 text-base min-h-[100px]',
        lg: 'px-5 py-4 text-lg min-h-[120px]',
      },
    },
  }
);

const labelVariants = cva(
  'absolute pointer-events-none transition-all duration-200 transform origin-left font-medium',
  {
    variants: {
      variant: {
        default: 'text-text-secondary peer-focus:text-primary-600',
        error: 'text-error-600 peer-focus:text-error-700',
        success: 'text-success-600 peer-focus:text-success-700',
        warning: 'text-warning-600 peer-focus:text-warning-700',
      },
      size: {
        sm: 'text-sm peer-placeholder-shown:text-sm peer-focus:text-xs peer-placeholder-shown:top-2 peer-focus:top-1 peer-placeholder-shown:left-3 peer-focus:left-3',
        md: 'text-base peer-placeholder-shown:text-base peer-focus:text-sm peer-placeholder-shown:top-3 peer-focus:top-1.5 peer-placeholder-shown:left-4 peer-focus:left-4',
        lg: 'text-lg peer-placeholder-shown:text-lg peer-focus:text-base peer-placeholder-shown:top-4 peer-focus:top-2 peer-placeholder-shown:left-5 peer-focus:left-5',
      },
      state: {
        floating: '',
        placeholder: '',
      },
    },
    compoundVariants: [
      {
        size: 'sm',
        state: 'floating',
        className: 'text-xs top-1 left-3',
      },
      {
        size: 'md', 
        state: 'floating',
        className: 'text-sm top-1.5 left-4',
      },
      {
        size: 'lg',
        state: 'floating', 
        className: 'text-base top-2 left-5',
      },
      {
        size: 'sm',
        state: 'placeholder',
        className: 'text-sm top-2 left-3',
      },
      {
        size: 'md',
        state: 'placeholder',
        className: 'text-base top-3 left-4',
      },
      {
        size: 'lg',
        state: 'placeholder',
        className: 'text-lg top-4 left-5',
      },
    ],
  }
);

interface ValidationState {
  isValid: boolean;
  message?: string;
  type?: 'error' | 'warning' | 'success';
}

export interface FloatingTextareaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'>,
    VariantProps<typeof floatingTextareaVariants> {
  label: string;
  validation?: ValidationState;
  helper?: string;
  required?: boolean;
  showValidationIcon?: boolean;
  autoResize?: boolean;
  maxRows?: number;
  minRows?: number;
  showCharCount?: boolean;
  maxLength?: number;
}

const FloatingTextarea = React.forwardRef<HTMLTextAreaElement, FloatingTextareaProps>(
  ({ 
    className, 
    variant, 
    size = 'md',
    label, 
    validation,
    helper,
    required,
    showValidationIcon = true,
    autoResize = false,
    maxRows = 10,
    minRows = 3,
    showCharCount = false,
    maxLength,
    ...props 
  }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const [hasValue, setHasValue] = useState(false);
    const [charCount, setCharCount] = useState(0);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Combine refs
    const combinedRef = (node: HTMLTextAreaElement) => {
      if (textareaRef.current) textareaRef.current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref) ref.current = node;
    };

    useEffect(() => {
      if (textareaRef.current) {
        const value = textareaRef.current.value;
        setHasValue(!!value);
        setCharCount(value.length);
        
        if (autoResize) {
          autoResizeTextarea();
        }
      }
    }, [props.value, props.defaultValue, autoResize]);

    const autoResizeTextarea = () => {
      if (!textareaRef.current || !autoResize) return;
      
      const textarea = textareaRef.current;
      const lineHeight = parseInt(getComputedStyle(textarea).lineHeight, 10);
      const paddingTop = parseInt(getComputedStyle(textarea).paddingTop, 10);
      const paddingBottom = parseInt(getComputedStyle(textarea).paddingBottom, 10);
      
      // Reset height to calculate scrollHeight
      textarea.style.height = 'auto';
      
      const scrollHeight = textarea.scrollHeight;
      const minHeight = lineHeight * minRows + paddingTop + paddingBottom;
      const maxHeight = lineHeight * maxRows + paddingTop + paddingBottom;
      
      const newHeight = Math.max(minHeight, Math.min(maxHeight, scrollHeight));
      textarea.style.height = `${newHeight}px`;
    };

    const handleFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
      setIsFocused(true);
      props.onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
      setIsFocused(false);
      setHasValue(!!e.target.value);
      props.onBlur?.(e);
    };

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const value = e.target.value;
      setHasValue(!!value);
      setCharCount(value.length);
      
      if (autoResize) {
        setTimeout(autoResizeTextarea, 0);
      }
      
      props.onChange?.(e);
    };

    // Determine variant based on validation
    const effectiveVariant = validation?.type || variant || 'default';
    
    // Determine label state
    const isFloating = isFocused || hasValue;
    const labelState = isFloating ? 'floating' : 'placeholder';

    const getValidationIcon = () => {
      if (!showValidationIcon || !validation) return null;
      
      const iconClasses = 'w-5 h-5';
      switch (validation.type) {
        case 'success':
          return (
            <svg className={`${iconClasses} text-success-500`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          );
        case 'error':
          return (
            <svg className={`${iconClasses} text-error-500`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          );
        case 'warning':
          return (
            <svg className={`${iconClasses} text-warning-500`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          );
        default:
          return null;
      }
    };

    const isCharCountWarning = maxLength && charCount > maxLength * 0.8;
    const isCharCountError = maxLength && charCount > maxLength;

    return (
      <div className={cn(floatingTextareaVariants({ variant: effectiveVariant, size, className }))}>
        <div className="relative">
          <textarea
            ref={combinedRef}
            className={cn(
              textareaVariants({ variant: effectiveVariant, size }),
              showValidationIcon && validation ? 'pr-12' : '',
              autoResize ? 'overflow-hidden' : 'overflow-auto'
            )}
            placeholder={label}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleChange}
            maxLength={maxLength}
            {...props}
          />
          
          <label
            className={cn(
              labelVariants({ 
                variant: effectiveVariant, 
                size, 
                state: labelState 
              })
            )}
          >
            {label}
            {required && <span className="text-error-500 ml-1">*</span>}
          </label>

          {/* Validation Icon */}
          {showValidationIcon && validation && (
            <div className="absolute right-3 top-3">
              {getValidationIcon()}
            </div>
          )}
        </div>

        {/* Footer with helper text and character count */}
        <div className="mt-2 space-y-1">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              {validation?.message && (
                <p className={cn(
                  'text-xs font-medium',
                  {
                    'text-error-600': validation.type === 'error',
                    'text-warning-600': validation.type === 'warning', 
                    'text-success-600': validation.type === 'success',
                    'text-text-secondary': !validation.type,
                  }
                )}>
                  {validation.message}
                </p>
              )}
              {helper && !validation?.message && (
                <p className="text-xs text-text-tertiary">
                  {helper}
                </p>
              )}
            </div>
            
            {/* Character Count */}
            {showCharCount && (
              <div className="flex-shrink-0 ml-4">
                <span className={cn(
                  'text-xs',
                  {
                    'text-error-600': isCharCountError,
                    'text-warning-600': isCharCountWarning && !isCharCountError,
                    'text-text-tertiary': !isCharCountWarning && !isCharCountError,
                  }
                )}>
                  {charCount}
                  {maxLength && ` / ${maxLength}`}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
);

FloatingTextarea.displayName = 'FloatingTextarea';

export { FloatingTextarea };