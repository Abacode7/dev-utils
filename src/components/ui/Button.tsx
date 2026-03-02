import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-xl text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mauve focus-visible:ring-offset-2 focus-visible:ring-offset-base disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        default: 'bg-surface0 text-text hover:bg-surface1 active:bg-surface2 border border-surface1',
        primary: 'bg-mauve text-crust hover:bg-lavender active:opacity-90 shadow-lg hover:shadow-glow-mauve',
        secondary: 'bg-surface0/50 backdrop-blur-sm border border-surface1 text-text hover:bg-surface0 active:bg-surface1',
        ghost: 'text-subtext1 hover:text-text hover:bg-surface0/50 active:bg-surface0',
        accent: 'bg-teal text-crust hover:bg-sky active:opacity-90 shadow-lg hover:shadow-glow-teal',
        danger: 'bg-red text-crust hover:bg-maroon active:opacity-90',
        outline: 'border border-surface1 bg-transparent text-text hover:bg-surface0/50 active:bg-surface0',
        success: 'bg-green text-crust hover:opacity-90 active:opacity-80 shadow-lg hover:shadow-glow-green',
        destructive: 'bg-red text-crust hover:bg-maroon active:opacity-90',
      },
      size: {
        default: 'h-10 py-2 px-4',
        sm: 'h-9 px-3 text-sm',
        lg: 'h-12 px-6 text-base',
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
