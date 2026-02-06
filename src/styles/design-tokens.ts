// Design Tokens - Enterprise SaaS Design System
export const designTokens = {
  // Color Palette with Semantic Tokens
  colors: {
    // Primary - Neutral scale for professional look
    primary: {
      50: '#fafafa',
      100: '#f4f4f5',
      200: '#e4e4e7',
      300: '#d4d4d8',
      400: '#a1a1aa',
      500: '#71717a',
      600: '#52525b',
      700: '#3f3f46',
      800: '#27272a',
      900: '#18181b',
      950: '#09090b'
    },

    // Accent - Sky blue for CTAs
    accent: {
      50: '#f0f9ff',
      100: '#e0f2fe',
      200: '#bae6fd',
      300: '#7dd3fc',
      400: '#38bdf8',
      500: '#0ea5e9',
      600: '#0284c7',
      700: '#0369a1',
      800: '#075985',
      900: '#0c4a6e'
    },

    // Success States
    success: {
      50: '#f0fdf4',
      100: '#dcfce7',
      200: '#bbf7d0',
      300: '#86efac',
      400: '#4ade80',
      500: '#22c55e',
      600: '#16a34a',
      700: '#15803d',
      800: '#166534',
      900: '#14532d'
    },

    // Warning States
    warning: {
      50: '#fffbeb',
      100: '#fef3c7',
      200: '#fde68a',
      300: '#fcd34d',
      400: '#fbbf24',
      500: '#f59e0b',
      600: '#d97706',
      700: '#b45309',
      800: '#92400e',
      900: '#78350f'
    },

    // Error States
    error: {
      50: '#fef2f2',
      100: '#fee2e2',
      200: '#fecaca',
      300: '#fca5a5',
      400: '#f87171',
      500: '#ef4444',
      600: '#dc2626',
      700: '#b91c1c',
      800: '#991b1b',
      900: '#7f1d1d'
    },

    // Neutral/Gray Scale
    neutral: {
      0: '#ffffff',
      50: '#fafafa',
      100: '#f4f4f5',
      200: '#e4e4e7',
      300: '#d4d4d8',
      400: '#a1a1aa',
      500: '#71717a',
      600: '#52525b',
      700: '#3f3f46',
      800: '#27272a',
      900: '#18181b',
      950: '#09090b'
    },

    // Semantic Colors
    background: {
      primary: '#ffffff',
      secondary: '#fafafa',
      tertiary: '#f4f4f5',
      inverse: '#18181b'
    },

    text: {
      primary: '#18181b',
      secondary: '#52525b',
      tertiary: '#71717a',
      inverse: '#ffffff',
      disabled: '#a1a1aa'
    },

    border: {
      primary: '#e4e4e7',
      secondary: '#d4d4d8',
      focus: '#18181b',
      error: '#ef4444'
    },

    surface: {
      primary: '#ffffff',
      secondary: '#fafafa',
      tertiary: '#f4f4f5',
      elevated: '#ffffff',
      overlay: 'rgba(0, 0, 0, 0.5)'
    }
  },

  // Typography Scale
  typography: {
    fontFamily: {
      sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      mono: ['JetBrains Mono', 'Menlo', 'Monaco', 'Courier New', 'monospace']
    },

    fontSize: {
      xs: ['0.75rem', { lineHeight: '1rem' }],
      sm: ['0.875rem', { lineHeight: '1.25rem' }],
      base: ['1rem', { lineHeight: '1.5rem' }],
      lg: ['1.125rem', { lineHeight: '1.75rem' }],
      xl: ['1.25rem', { lineHeight: '1.75rem' }],
      '2xl': ['1.5rem', { lineHeight: '2rem' }],
      '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
      '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
      '5xl': ['3rem', { lineHeight: '1' }],
      '6xl': ['3.75rem', { lineHeight: '1' }],
      '7xl': ['4.5rem', { lineHeight: '1' }],
      '8xl': ['6rem', { lineHeight: '1' }],
      '9xl': ['8rem', { lineHeight: '1' }]
    },

    fontWeight: {
      thin: '100',
      extralight: '200',
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
      black: '900'
    },

    letterSpacing: {
      tighter: '-0.05em',
      tight: '-0.025em',
      normal: '0em',
      wide: '0.025em',
      wider: '0.05em',
      widest: '0.1em'
    }
  },

  // Spacing Scale
  spacing: {
    px: '1px',
    0: '0',
    0.5: '0.125rem',
    1: '0.25rem',
    1.5: '0.375rem',
    2: '0.5rem',
    2.5: '0.625rem',
    3: '0.75rem',
    3.5: '0.875rem',
    4: '1rem',
    5: '1.25rem',
    6: '1.5rem',
    7: '1.75rem',
    8: '2rem',
    9: '2.25rem',
    10: '2.5rem',
    11: '2.75rem',
    12: '3rem',
    14: '3.5rem',
    16: '4rem',
    20: '5rem',
    24: '6rem',
    28: '7rem',
    32: '8rem',
    36: '9rem',
    40: '10rem',
    44: '11rem',
    48: '12rem',
    52: '13rem',
    56: '14rem',
    60: '15rem',
    64: '16rem',
    72: '18rem',
    80: '20rem',
    96: '24rem'
  },

  // Border Radius
  borderRadius: {
    none: '0',
    sm: '4px',
    DEFAULT: '6px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    '2xl': '20px',
    '3xl': '24px',
    full: '9999px'
  },

  // Shadows - Clean, subtle elevation
  boxShadow: {
    none: 'none',
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)'
  },

  // Animation & Transitions
  animation: {
    duration: {
      75: '75ms',
      100: '100ms',
      150: '150ms',
      200: '200ms',
      300: '300ms',
      500: '500ms',
      700: '700ms',
      1000: '1000ms'
    },

    easing: {
      linear: 'linear',
      in: 'cubic-bezier(0.4, 0, 1, 1)',
      out: 'cubic-bezier(0, 0, 0.2, 1)',
      inOut: 'cubic-bezier(0.4, 0, 0.2, 1)'
    }
  },

  // Z-Index Scale
  zIndex: {
    auto: 'auto',
    0: '0',
    10: '10',
    20: '20',
    30: '30',
    40: '40',
    50: '50',
    dropdown: '1000',
    sticky: '1020',
    fixed: '1030',
    header: '1040',
    modal: '1050',
    popover: '1060',
    tooltip: '1070',
    notification: '1080',
    overlay: '1090'
  },

  // Breakpoints
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px'
  }
} as const;

// Dark Mode Tokens
export const darkTokens = {
  colors: {
    background: {
      primary: '#09090b',
      secondary: '#18181b',
      tertiary: '#27272a',
      inverse: '#ffffff'
    },

    text: {
      primary: '#fafafa',
      secondary: '#a1a1aa',
      tertiary: '#71717a',
      inverse: '#18181b',
      disabled: '#52525b'
    },

    border: {
      primary: '#27272a',
      secondary: '#3f3f46',
      focus: '#fafafa',
      error: '#f87171'
    },

    surface: {
      primary: '#18181b',
      secondary: '#27272a',
      tertiary: '#3f3f46',
      elevated: '#27272a',
      overlay: 'rgba(0, 0, 0, 0.8)'
    }
  }
} as const;

// CSS Custom Properties Generator
export const generateCSSVariables = (tokens: typeof designTokens, isDark = false) => {
  const theme = isDark ? { ...tokens, colors: { ...tokens.colors, ...darkTokens.colors } } : tokens;

  const cssVars: Record<string, string> = {};

  // Generate color variables
  Object.entries(theme.colors).forEach(([category, colors]) => {
    if (typeof colors === 'object') {
      Object.entries(colors).forEach(([key, value]) => {
        cssVars[`--color-${category}-${key}`] = value as string;
      });
    }
  });

  // Generate spacing variables
  Object.entries(theme.spacing).forEach(([key, value]) => {
    cssVars[`--spacing-${key}`] = value;
  });

  // Generate typography variables
  Object.entries(theme.typography.fontSize).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      cssVars[`--font-size-${key}`] = value[0];
      cssVars[`--line-height-${key}`] = value[1].lineHeight;
    }
  });

  return cssVars;
};

export type DesignTokens = typeof designTokens;
