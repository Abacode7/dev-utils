import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        default: 'bg-neutral-900 text-white hover:bg-neutral-800 active:bg-neutral-700',
        secondary: 'bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50 active:bg-neutral-100',
        ghost: 'text-neutral-600 hover:bg-neutral-100 active:bg-neutral-200',
        accent: 'bg-sky-500 text-white hover:bg-sky-600 active:bg-sky-700',
        danger: 'bg-red-500 text-white hover:bg-red-600 active:bg-red-700',
        outline: 'border border-neutral-200 bg-transparent text-neutral-700 hover:bg-neutral-50 active:bg-neutral-100',
        success: 'bg-green-600 text-white hover:bg-green-700 active:bg-green-800',
        destructive: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800',
      },
      size: {
        default: 'h-10 py-2 px-4',
        sm: 'h-9 px-3 text-sm',
        lg: 'h-11 px-6 text-base',
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
