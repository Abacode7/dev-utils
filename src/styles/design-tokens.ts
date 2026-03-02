// Design Tokens - Terminal Luxe Design System
// Inspired by Catppuccin Mocha with warm, premium aesthetics

export const designTokens = {
  // Catppuccin Mocha Color Palette
  colors: {
    // Base colors - Deep, warm backgrounds
    base: {
      crust: '#11111b',
      mantle: '#181825',
      base: '#1e1e2e',
      surface0: '#313244',
      surface1: '#45475a',
      surface2: '#585b70',
      overlay0: '#6c7086',
      overlay1: '#7f849c',
      overlay2: '#9399b2',
    },

    // Text colors - Soft, readable
    text: {
      subtext0: '#a6adc8',
      subtext1: '#bac2de',
      text: '#cdd6f4',
    },

    // Accent colors - Vibrant pastels
    accents: {
      rosewater: '#f5e0dc',
      flamingo: '#f2cdcd',
      pink: '#f5c2e7',
      mauve: '#cba6f7',
      red: '#f38ba8',
      maroon: '#eba0ac',
      peach: '#fab387',
      yellow: '#f9e2af',
      green: '#a6e3a1',
      teal: '#94e2d5',
      sky: '#89dceb',
      sapphire: '#74c7ec',
      blue: '#89b4fa',
      lavender: '#b4befe',
    },

    // Tool-specific accent mapping
    tools: {
      json: '#f5c2e7',      // pink - JSON Validator
      minify: '#94e2d5',    // teal - JSON Minifier
      jwt: '#cba6f7',       // mauve - JWT Decoder
      jasypt: '#a6e3a1',    // green - Jasypt Encryption
    },

    // Semantic colors mapped to Catppuccin
    success: {
      50: 'rgba(166, 227, 161, 0.1)',
      100: 'rgba(166, 227, 161, 0.2)',
      200: 'rgba(166, 227, 161, 0.3)',
      500: '#a6e3a1',
      600: '#94d391',
      700: '#82c381',
    },

    warning: {
      50: 'rgba(249, 226, 175, 0.1)',
      100: 'rgba(249, 226, 175, 0.2)',
      200: 'rgba(249, 226, 175, 0.3)',
      500: '#f9e2af',
      600: '#f7d99a',
      700: '#f5d085',
    },

    error: {
      50: 'rgba(243, 139, 168, 0.1)',
      100: 'rgba(243, 139, 168, 0.2)',
      200: 'rgba(243, 139, 168, 0.3)',
      500: '#f38ba8',
      600: '#f17a9a',
      700: '#ef698c',
    },

    info: {
      50: 'rgba(137, 180, 250, 0.1)',
      100: 'rgba(137, 180, 250, 0.2)',
      200: 'rgba(137, 180, 250, 0.3)',
      500: '#89b4fa',
      600: '#77a8f9',
      700: '#659cf8',
    },

    // Background semantic
    background: {
      primary: '#1e1e2e',
      secondary: '#181825',
      tertiary: '#11111b',
      elevated: '#313244',
      inverse: '#cdd6f4',
    },

    // Surface semantic
    surface: {
      primary: '#1e1e2e',
      secondary: '#313244',
      tertiary: '#45475a',
      elevated: '#45475a',
      overlay: 'rgba(17, 17, 27, 0.85)',
      glass: 'rgba(49, 50, 68, 0.6)',
    },

    // Border semantic
    border: {
      primary: '#313244',
      secondary: '#45475a',
      tertiary: '#585b70',
      focus: '#cba6f7',
      error: '#f38ba8',
    },

    // Gradients
    gradients: {
      primary: 'linear-gradient(135deg, #cba6f7 0%, #f5c2e7 100%)',
      secondary: 'linear-gradient(135deg, #94e2d5 0%, #89dceb 100%)',
      accent: 'linear-gradient(135deg, #f5c2e7 0%, #cba6f7 50%, #89b4fa 100%)',
      mesh: `
        radial-gradient(at 40% 20%, rgba(203, 166, 247, 0.15) 0px, transparent 50%),
        radial-gradient(at 80% 0%, rgba(245, 194, 231, 0.1) 0px, transparent 50%),
        radial-gradient(at 0% 50%, rgba(148, 226, 213, 0.1) 0px, transparent 50%),
        radial-gradient(at 80% 50%, rgba(137, 180, 250, 0.08) 0px, transparent 50%),
        radial-gradient(at 0% 100%, rgba(249, 226, 175, 0.08) 0px, transparent 50%)
      `,
    },
  },

  // Light theme overrides
  lightColors: {
    base: {
      crust: '#dce0e8',
      mantle: '#e6e9ef',
      base: '#eff1f5',
      surface0: '#ccd0da',
      surface1: '#bcc0cc',
      surface2: '#acb0be',
      overlay0: '#9ca0b0',
      overlay1: '#8c8fa1',
      overlay2: '#7c7f93',
    },
    text: {
      subtext0: '#6c6f85',
      subtext1: '#5c5f77',
      text: '#4c4f69',
    },
    background: {
      primary: '#eff1f5',
      secondary: '#e6e9ef',
      tertiary: '#dce0e8',
      elevated: '#ccd0da',
      inverse: '#4c4f69',
    },
    surface: {
      primary: '#eff1f5',
      secondary: '#ccd0da',
      tertiary: '#bcc0cc',
      elevated: '#bcc0cc',
      overlay: 'rgba(220, 224, 232, 0.9)',
      glass: 'rgba(204, 208, 218, 0.6)',
    },
    border: {
      primary: '#ccd0da',
      secondary: '#bcc0cc',
      tertiary: '#acb0be',
      focus: '#8839ef',
      error: '#d20f39',
    },
    gradients: {
      mesh: `
        radial-gradient(at 40% 20%, rgba(136, 57, 239, 0.08) 0px, transparent 50%),
        radial-gradient(at 80% 0%, rgba(234, 118, 203, 0.06) 0px, transparent 50%),
        radial-gradient(at 0% 50%, rgba(23, 146, 153, 0.06) 0px, transparent 50%),
        radial-gradient(at 80% 50%, rgba(30, 102, 245, 0.05) 0px, transparent 50%),
        radial-gradient(at 0% 100%, rgba(223, 142, 29, 0.05) 0px, transparent 50%)
      `,
    },
  },

  // Typography Scale
  typography: {
    fontFamily: {
      sans: ['Satoshi', 'system-ui', '-apple-system', 'sans-serif'],
      display: ['Satoshi', 'system-ui', '-apple-system', 'sans-serif'],
      mono: ['JetBrains Mono', 'SF Mono', 'Monaco', 'monospace'],
    },

    fontSize: {
      xs: ['0.75rem', { lineHeight: '1rem' }],
      sm: ['0.875rem', { lineHeight: '1.25rem' }],
      base: ['1rem', { lineHeight: '1.6' }],
      lg: ['1.125rem', { lineHeight: '1.75rem' }],
      xl: ['1.25rem', { lineHeight: '1.75rem' }],
      '2xl': ['1.5rem', { lineHeight: '2rem' }],
      '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
      '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
      '5xl': ['3rem', { lineHeight: '1.1' }],
      '6xl': ['3.75rem', { lineHeight: '1' }],
      '7xl': ['4.5rem', { lineHeight: '1' }],
      '8xl': ['6rem', { lineHeight: '1' }],
      '9xl': ['8rem', { lineHeight: '1' }],
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
      black: '900',
    },

    letterSpacing: {
      tighter: '-0.05em',
      tight: '-0.025em',
      normal: '0em',
      wide: '0.025em',
      wider: '0.05em',
      widest: '0.1em',
    },
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
    96: '24rem',
  },

  // Border Radius
  borderRadius: {
    none: '0',
    sm: '6px',
    DEFAULT: '8px',
    md: '12px',
    lg: '16px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '32px',
    full: '9999px',
  },

  // Shadows - Elevated, glowing
  boxShadow: {
    none: 'none',
    sm: '0 2px 8px -2px rgba(0, 0, 0, 0.3)',
    DEFAULT: '0 4px 16px -4px rgba(0, 0, 0, 0.4)',
    md: '0 8px 24px -6px rgba(0, 0, 0, 0.5)',
    lg: '0 16px 40px -8px rgba(0, 0, 0, 0.5)',
    xl: '0 24px 56px -12px rgba(0, 0, 0, 0.6)',
    '2xl': '0 32px 72px -16px rgba(0, 0, 0, 0.7)',
    inner: 'inset 0 2px 8px 0 rgba(0, 0, 0, 0.3)',
    // Glow shadows
    glow: {
      pink: '0 0 40px -8px rgba(245, 194, 231, 0.4)',
      mauve: '0 0 40px -8px rgba(203, 166, 247, 0.4)',
      teal: '0 0 40px -8px rgba(148, 226, 213, 0.4)',
      green: '0 0 40px -8px rgba(166, 227, 161, 0.4)',
      blue: '0 0 40px -8px rgba(137, 180, 250, 0.4)',
    },
    // Glass shadows
    glass: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
    glassLg: '0 16px 48px 0 rgba(0, 0, 0, 0.4)',
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
      1000: '1000ms',
    },

    easing: {
      linear: 'linear',
      in: 'cubic-bezier(0.4, 0, 1, 1)',
      out: 'cubic-bezier(0, 0, 0.2, 1)',
      inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      smooth: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
    },
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
    overlay: '1090',
  },

  // Breakpoints
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },

  // Glassmorphism
  glass: {
    blur: '16px',
    saturate: '180%',
    opacity: '0.6',
  },
} as const;

// Export individual color palettes for easy access
export const catppuccin = {
  mocha: designTokens.colors,
  latte: designTokens.lightColors,
};

export type DesignTokens = typeof designTokens;
