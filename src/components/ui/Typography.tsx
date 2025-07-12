import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';

// Enterprise Heading Component
const headingVariants = cva(
  'font-display font-semibold tracking-tight text-text-primary',
  {
    variants: {
      size: {
        h1: 'text-4xl md:text-5xl lg:text-6xl leading-none',
        h2: 'text-3xl md:text-4xl lg:text-5xl leading-tight',
        h3: 'text-2xl md:text-3xl lg:text-4xl leading-tight',
        h4: 'text-xl md:text-2xl lg:text-3xl leading-snug',
        h5: 'text-lg md:text-xl lg:text-2xl leading-snug',
        h6: 'text-base md:text-lg lg:text-xl leading-normal'
      },
      weight: {
        light: 'font-light',
        normal: 'font-normal',
        medium: 'font-medium',
        semibold: 'font-semibold',
        bold: 'font-bold',
        extrabold: 'font-extrabold'
      },
      gradient: {
        none: '',
        primary: 'bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent',
        secondary: 'bg-gradient-to-r from-secondary-600 to-secondary-700 bg-clip-text text-transparent',
        rainbow: 'bg-gradient-to-r from-primary-500 via-secondary-500 to-primary-600 bg-clip-text text-transparent',
        enterprise: 'bg-gradient-to-r from-primary-700 via-primary-600 to-secondary-600 bg-clip-text text-transparent'
      }
    },
    defaultVariants: {
      size: 'h3',
      weight: 'semibold',
      gradient: 'none'
    }
  }
);

export interface HeadingProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof headingVariants> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  children: React.ReactNode;
}

const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, size, weight, gradient, as, children, ...props }, ref) => {
    const Component = as || (size === 'h1' ? 'h1' : size === 'h2' ? 'h2' : size === 'h3' ? 'h3' : size === 'h4' ? 'h4' : size === 'h5' ? 'h5' : 'h6');
    
    return (
      <Component
        ref={ref}
        className={cn(headingVariants({ size, weight, gradient }), className)}
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
  'text-text-primary',
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
        primary: 'text-text-primary',
        secondary: 'text-text-secondary',
        tertiary: 'text-text-tertiary',
        inverse: 'text-text-inverse',
        disabled: 'text-text-disabled',
        success: 'text-success-700',
        warning: 'text-warning-700',
        error: 'text-error-700',
        info: 'text-primary-700'
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
          variant === 'inline' && 'px-1.5 py-0.5 bg-surface-secondary rounded-md border border-border-primary',
          variant === 'block' && 'p-4 bg-surface-secondary rounded-lg border border-border-primary overflow-x-auto',
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
        className: cn('text-sm text-text-tertiary', className),
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
        className={cn('text-lg text-text-secondary leading-relaxed', className)}
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
        className={cn('text-lg font-medium text-text-primary', className)}
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
        className: cn('text-sm font-medium leading-none text-text-secondary', className),
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