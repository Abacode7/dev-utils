import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';

// Enterprise Heading Component
const headingVariants = cva(
  'font-semibold tracking-tight text-neutral-900',
  {
    variants: {
      size: {
        h1: 'text-4xl md:text-5xl leading-tight',
        h2: 'text-3xl md:text-4xl leading-tight',
        h3: 'text-2xl md:text-3xl leading-snug',
        h4: 'text-xl md:text-2xl leading-snug',
        h5: 'text-lg md:text-xl leading-normal',
        h6: 'text-base md:text-lg leading-normal'
      },
      weight: {
        light: 'font-light',
        normal: 'font-normal',
        medium: 'font-medium',
        semibold: 'font-semibold',
        bold: 'font-bold'
      }
    },
    defaultVariants: {
      size: 'h3',
      weight: 'semibold'
    }
  }
);

export interface HeadingProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof headingVariants> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  children: React.ReactNode;
  gradient?: string; // Kept for backwards compatibility but ignored
}

const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ({ className, size, weight, as, children, gradient: _gradient, ...props }, ref) => {
    const Component = as || (size === 'h1' ? 'h1' : size === 'h2' ? 'h2' : size === 'h3' ? 'h3' : size === 'h4' ? 'h4' : size === 'h5' ? 'h5' : 'h6');

    return (
      <Component
        ref={ref}
        className={cn(headingVariants({ size, weight }), className)}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Heading.displayName = 'Heading';

// Enterprise Text Component
const textVariants = cva(
  'text-neutral-900',
  {
    variants: {
      size: {
        xs: 'text-xs',
        sm: 'text-sm',
        base: 'text-base',
        lg: 'text-lg',
        xl: 'text-xl',
        '2xl': 'text-2xl'
      },
      weight: {
        light: 'font-light',
        normal: 'font-normal',
        medium: 'font-medium',
        semibold: 'font-semibold',
        bold: 'font-bold'
      },
      color: {
        primary: 'text-neutral-900',
        secondary: 'text-neutral-600',
        tertiary: 'text-neutral-500',
        inverse: 'text-white',
        disabled: 'text-neutral-400',
        success: 'text-green-700',
        warning: 'text-amber-700',
        error: 'text-red-700',
        info: 'text-sky-700'
      },
      leading: {
        none: 'leading-none',
        tight: 'leading-tight',
        snug: 'leading-snug',
        normal: 'leading-normal',
        relaxed: 'leading-relaxed',
        loose: 'leading-loose'
      }
    },
    defaultVariants: {
      size: 'base',
      weight: 'normal',
      color: 'primary',
      leading: 'normal'
    }
  }
);

export interface TextProps
  extends Omit<React.HTMLAttributes<HTMLElement>, 'color'>,
    VariantProps<typeof textVariants> {
  as?: 'p' | 'span' | 'div' | 'label';
  children: React.ReactNode;
}

const Text = React.forwardRef<HTMLElement, TextProps>(
  ({ className, size, weight, color, leading, as = 'p', children, ...props }, ref) => {
    const Component = as;

    return React.createElement(
      Component,
      {
        ref,
        className: cn(textVariants({ size, weight, color, leading }), className),
        ...props
      },
      children
    );
  }
);

Text.displayName = 'Text';

// Code Text Component
export interface CodeProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  variant?: 'inline' | 'block';
}

const Code = React.forwardRef<HTMLElement, CodeProps>(
  ({ className, variant = 'inline', children, ...props }, ref) => {
    const Component = variant === 'block' ? 'pre' : 'code';

    return React.createElement(
      Component,
      {
        ref,
        className: cn(
          'font-mono text-sm',
          variant === 'inline' && 'px-1.5 py-0.5 bg-neutral-100 rounded-md border border-neutral-200 text-neutral-800',
          variant === 'block' && 'p-4 bg-neutral-100 rounded-lg border border-neutral-200 overflow-x-auto text-neutral-800',
          className
        ),
        ...props
      },
      children
    );
  }
);

Code.displayName = 'Code';

// Muted Text Component
export interface MutedProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
  as?: 'p' | 'span' | 'div';
}

const Muted = React.forwardRef<HTMLElement, MutedProps>(
  ({ className, as = 'p', children, ...props }, ref) => {
    return React.createElement(
      as,
      {
        ref,
        className: cn('text-sm text-neutral-500', className),
        ...props
      },
      children
    );
  }
);

Muted.displayName = 'Muted';

// Lead Text Component
export interface LeadProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
}

const Lead = React.forwardRef<HTMLParagraphElement, LeadProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <p
        ref={ref}
        className={cn('text-lg text-neutral-600 leading-relaxed', className)}
        {...props}
      >
        {children}
      </p>
    );
  }
);

Lead.displayName = 'Lead';

// Large Text Component
export interface LargeProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
}

const Large = React.forwardRef<HTMLParagraphElement, LargeProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <p
        ref={ref}
        className={cn('text-lg font-medium text-neutral-900', className)}
        {...props}
      >
        {children}
      </p>
    );
  }
);

Large.displayName = 'Large';

// Small Text Component
export interface SmallProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
  as?: 'p' | 'span' | 'small';
}

const Small = React.forwardRef<HTMLElement, SmallProps>(
  ({ className, as = 'small', children, ...props }, ref) => {
    return React.createElement(
      as,
      {
        ref,
        className: cn('text-sm font-medium leading-none text-neutral-600', className),
        ...props
      },
      children
    );
  }
);

Small.displayName = 'Small';

export {
  Heading,
  Text,
  Code,
  Muted,
  Lead,
  Large,
  Small,
  headingVariants, // eslint-disable-line react-refresh/only-export-components
  textVariants // eslint-disable-line react-refresh/only-export-components
};
