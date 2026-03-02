import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';

const inputVariants = cva(
  'flex w-full rounded-xl border bg-surface0 px-4 py-2 text-sm text-text transition-all duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-overlay0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mauve focus-visible:ring-offset-2 focus-visible:ring-offset-base disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-surface1',
  {
    variants: {
      variant: {
        default: 'border-surface1 hover:border-surface2 focus:border-mauve',
        error: 'border-red focus-visible:ring-red',
        success: 'border-green focus-visible:ring-green',
        glass: 'bg-surface0/50 backdrop-blur-sm border-surface1/50 hover:bg-surface0/70',
      },
      inputSize: {
        default: 'h-11',
        sm: 'h-9 text-sm px-3',
        lg: 'h-12 text-base px-5',
      },
    },
    defaultVariants: {
      variant: 'default',
      inputSize: 'default',
    },
  }
);

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  size?: 'default' | 'sm' | 'lg';
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, size, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(inputVariants({ variant, inputSize: size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';

export { Input };
