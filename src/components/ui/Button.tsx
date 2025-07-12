import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background',
  {
    variants: {
      variant: {
        default: 'bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800',
        destructive: 'bg-error-600 text-white hover:bg-error-700 active:bg-error-800',
        outline: 'border border-border-primary hover:bg-neutral-50 active:bg-neutral-100',
        secondary: 'bg-secondary-600 text-white hover:bg-secondary-700 active:bg-secondary-800',
        ghost: 'hover:bg-neutral-100 active:bg-neutral-200',
        link: 'underline-offset-4 hover:underline text-primary-600',
        success: 'bg-success-600 text-white hover:bg-success-700 active:bg-success-800',
        warning: 'bg-warning-600 text-white hover:bg-warning-700 active:bg-warning-800',
      },
      size: {
        default: 'h-10 py-2 px-4',
        sm: 'h-9 px-3 rounded-md',
        lg: 'h-11 px-8 rounded-md',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants /* eslint-disable-line react-refresh/only-export-components */ };