// Typography System - Semantic Typography Scale
import { designTokens } from './design-tokens';

export const typography = {
  // Heading Scale
  h1: {
    fontSize: designTokens.typography.fontSize['4xl'][0],
    lineHeight: designTokens.typography.fontSize['4xl'][1].lineHeight,
    fontWeight: designTokens.typography.fontWeight.bold,
    letterSpacing: designTokens.typography.letterSpacing.tight,
    fontFamily: designTokens.typography.fontFamily.sans.join(', ')
  },

  h2: {
    fontSize: designTokens.typography.fontSize['3xl'][0],
    lineHeight: designTokens.typography.fontSize['3xl'][1].lineHeight,
    fontWeight: designTokens.typography.fontWeight.bold,
    letterSpacing: designTokens.typography.letterSpacing.tight,
    fontFamily: designTokens.typography.fontFamily.sans.join(', ')
  },

  h3: {
    fontSize: designTokens.typography.fontSize['2xl'][0],
    lineHeight: designTokens.typography.fontSize['2xl'][1].lineHeight,
    fontWeight: designTokens.typography.fontWeight.semibold,
    letterSpacing: designTokens.typography.letterSpacing.tight,
    fontFamily: designTokens.typography.fontFamily.sans.join(', ')
  },

  h4: {
    fontSize: designTokens.typography.fontSize.xl[0],
    lineHeight: designTokens.typography.fontSize.xl[1].lineHeight,
    fontWeight: designTokens.typography.fontWeight.semibold,
    letterSpacing: designTokens.typography.letterSpacing.normal,
    fontFamily: designTokens.typography.fontFamily.sans.join(', ')
  },

  h5: {
    fontSize: designTokens.typography.fontSize.lg[0],
    lineHeight: designTokens.typography.fontSize.lg[1].lineHeight,
    fontWeight: designTokens.typography.fontWeight.semibold,
    letterSpacing: designTokens.typography.letterSpacing.normal,
    fontFamily: designTokens.typography.fontFamily.sans.join(', ')
  },

  h6: {
    fontSize: designTokens.typography.fontSize.base[0],
    lineHeight: designTokens.typography.fontSize.base[1].lineHeight,
    fontWeight: designTokens.typography.fontWeight.semibold,
    letterSpacing: designTokens.typography.letterSpacing.normal,
    fontFamily: designTokens.typography.fontFamily.sans.join(', ')
  },

  // Body Text Scale
  body: {
    large: {
      fontSize: designTokens.typography.fontSize.lg[0],
      lineHeight: designTokens.typography.fontSize.lg[1].lineHeight,
      fontWeight: designTokens.typography.fontWeight.normal,
      letterSpacing: designTokens.typography.letterSpacing.normal,
      fontFamily: designTokens.typography.fontFamily.sans.join(', ')
    },

    medium: {
      fontSize: designTokens.typography.fontSize.base[0],
      lineHeight: designTokens.typography.fontSize.base[1].lineHeight,
      fontWeight: designTokens.typography.fontWeight.normal,
      letterSpacing: designTokens.typography.letterSpacing.normal,
      fontFamily: designTokens.typography.fontFamily.sans.join(', ')
    },

    small: {
      fontSize: designTokens.typography.fontSize.sm[0],
      lineHeight: designTokens.typography.fontSize.sm[1].lineHeight,
      fontWeight: designTokens.typography.fontWeight.normal,
      letterSpacing: designTokens.typography.letterSpacing.normal,
      fontFamily: designTokens.typography.fontFamily.sans.join(', ')
    }
  },

  // Utility Text Styles
  label: {
    fontSize: designTokens.typography.fontSize.sm[0],
    lineHeight: designTokens.typography.fontSize.sm[1].lineHeight,
    fontWeight: designTokens.typography.fontWeight.medium,
    letterSpacing: designTokens.typography.letterSpacing.normal,
    fontFamily: designTokens.typography.fontFamily.sans.join(', ')
  },

  caption: {
    fontSize: designTokens.typography.fontSize.xs[0],
    lineHeight: designTokens.typography.fontSize.xs[1].lineHeight,
    fontWeight: designTokens.typography.fontWeight.normal,
    letterSpacing: designTokens.typography.letterSpacing.normal,
    fontFamily: designTokens.typography.fontFamily.sans.join(', ')
  },

  button: {
    fontSize: designTokens.typography.fontSize.sm[0],
    lineHeight: designTokens.typography.fontSize.sm[1].lineHeight,
    fontWeight: designTokens.typography.fontWeight.medium,
    letterSpacing: designTokens.typography.letterSpacing.wide,
    fontFamily: designTokens.typography.fontFamily.sans.join(', ')
  },

  code: {
    fontSize: designTokens.typography.fontSize.sm[0],
    lineHeight: designTokens.typography.fontSize.sm[1].lineHeight,
    fontWeight: designTokens.typography.fontWeight.normal,
    letterSpacing: designTokens.typography.letterSpacing.normal,
    fontFamily: designTokens.typography.fontFamily.mono.join(', ')
  }
} as const;

// CSS-in-JS helper for component styling
export const getTypographyStyles = (variant: keyof typeof typography) => {
  if (variant === 'body') {
    return typography.body.medium;
  }
  return typography[variant];
};

// Tailwind CSS class mappings for typography
export const typographyClasses = {
  h1: 'text-4xl font-bold tracking-tight',
  h2: 'text-3xl font-bold tracking-tight',
  h3: 'text-2xl font-semibold tracking-tight',
  h4: 'text-xl font-semibold',
  h5: 'text-lg font-semibold',
  h6: 'text-base font-semibold',
  'body-large': 'text-lg',
  'body-medium': 'text-base',
  'body-small': 'text-sm',
  label: 'text-sm font-medium',
  caption: 'text-xs',
  button: 'text-sm font-medium tracking-wide',
  code: 'text-sm font-mono'
} as const;

export type TypographyVariant = keyof typeof typography;
export type TypographyClass = keyof typeof typographyClasses;
