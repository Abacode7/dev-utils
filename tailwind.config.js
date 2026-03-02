/** @type {import('tailwindcss').Config} */
import { designTokens } from './src/styles/design-tokens';

export default {
  darkMode: ['selector', '[data-theme="dark"]'],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    // Tool accent color classes
    {
      pattern: /^(bg|text|border)-(pink|teal|mauve|green)$/,
      variants: ['hover', 'group-hover'],
    },
    // Glow classes
    {
      pattern: /^glow-(pink|teal|mauve|green|blue)$/,
    },
  ],
  theme: {
    extend: {
      colors: {
        // Catppuccin Mocha base colors
        crust: 'var(--crust)',
        mantle: 'var(--mantle)',
        base: 'var(--base)',
        surface0: 'var(--surface0)',
        surface1: 'var(--surface1)',
        surface2: 'var(--surface2)',
        overlay0: 'var(--overlay0)',
        overlay1: 'var(--overlay1)',
        overlay2: 'var(--overlay2)',
        subtext0: 'var(--subtext0)',
        subtext1: 'var(--subtext1)',
        text: 'var(--text)',

        // Catppuccin accent colors
        rosewater: 'var(--rosewater)',
        flamingo: 'var(--flamingo)',
        pink: 'var(--pink)',
        mauve: 'var(--mauve)',
        red: 'var(--red)',
        maroon: 'var(--maroon)',
        peach: 'var(--peach)',
        yellow: 'var(--yellow)',
        green: 'var(--green)',
        teal: 'var(--teal)',
        sky: 'var(--sky)',
        sapphire: 'var(--sapphire)',
        blue: 'var(--blue)',
        lavender: 'var(--lavender)',

        // Semantic colors
        accent: 'var(--accent)',
        'accent-hover': 'var(--accent-hover)',

        // Tool-specific colors
        'tool-json': 'var(--tool-json)',
        'tool-minify': 'var(--tool-minify)',
        'tool-jwt': 'var(--tool-jwt)',
        'tool-jasypt': 'var(--tool-jasypt)',

        // Semantic scales
        success: designTokens.colors.success,
        warning: designTokens.colors.warning,
        error: designTokens.colors.error,
        info: designTokens.colors.info,
      },
      fontFamily: {
        sans: ['Satoshi', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Satoshi', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'SF Mono', 'Monaco', 'monospace'],
      },
      fontSize: designTokens.typography.fontSize,
      fontWeight: designTokens.typography.fontWeight,
      letterSpacing: designTokens.typography.letterSpacing,
      spacing: designTokens.spacing,
      borderRadius: designTokens.borderRadius,
      boxShadow: {
        sm: 'var(--shadow-sm)',
        DEFAULT: 'var(--shadow-base)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        xl: 'var(--shadow-xl)',
        '2xl': '0 32px 72px -16px rgba(0, 0, 0, 0.7)',
        inner: 'inset 0 2px 8px 0 rgba(0, 0, 0, 0.3)',
        // Glow shadows
        'glow-pink': 'var(--glow-pink)',
        'glow-mauve': 'var(--glow-mauve)',
        'glow-teal': 'var(--glow-teal)',
        'glow-green': 'var(--glow-green)',
        'glow-blue': 'var(--glow-blue)',
        // Glass shadows
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.4)',
        'glass-lg': '0 16px 48px 0 rgba(0, 0, 0, 0.5)',
      },
      zIndex: designTokens.zIndex,
      screens: designTokens.breakpoints,
      transitionDuration: designTokens.animation.duration,
      transitionTimingFunction: {
        ...designTokens.animation.easing,
        'bounce': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'smooth': 'cubic-bezier(0.25, 0.1, 0.25, 1)',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, var(--mauve) 0%, var(--pink) 100%)',
        'gradient-secondary': 'linear-gradient(135deg, var(--teal) 0%, var(--sky) 100%)',
        'gradient-accent': 'linear-gradient(135deg, var(--pink) 0%, var(--mauve) 50%, var(--blue) 100%)',
        'mesh': 'var(--mesh-gradient)',
      },
      backdropBlur: {
        'xs': '2px',
        'sm': '4px',
        'md': '8px',
        'lg': '16px',
        'xl': '24px',
        '2xl': '40px',
        '3xl': '64px',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-down': 'slideDown 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'scale-in': 'scaleIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'glow-pulse': 'glow-pulse 3s ease-in-out infinite',
        'gradient-shift': 'gradient-shift 8s ease infinite',
        'shimmer': 'shimmer 2s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-ring': 'pulse-ring 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin': 'spin 1s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'glow-pulse': {
          '0%, 100%': { opacity: '0.5', filter: 'blur(20px)' },
          '50%': { opacity: '0.8', filter: 'blur(30px)' },
        },
        'gradient-shift': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-ring': {
          '0%': { transform: 'scale(0.8)', opacity: '1' },
          '100%': { transform: 'scale(2)', opacity: '0' },
        },
        spin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
    },
  },
  plugins: [],
}
