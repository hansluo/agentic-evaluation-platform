/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Calm Intelligence — Surface system
        surface: '#f9f9fb',
        'surface-dim': '#d9dadc',
        'surface-bright': '#f9f9fb',
        'surface-container-lowest': '#ffffff',
        'surface-container-low': '#f3f3f5',
        'surface-container': '#eeeef0',
        'surface-container-high': '#e8e8ea',
        'surface-container-highest': '#e2e2e4',
        'on-surface': '#1a1c1d',
        'on-surface-variant': '#46464a',
        'inverse-surface': '#2f3132',
        'inverse-on-surface': '#f0f0f2',
        'outline-ci': '#77767b',
        'outline-variant': '#c7c6ca',
        'surface-tint': '#5f5e60',
        background: '#f9f9fb',
        'on-background': '#1a1c1d',
        'surface-variant-ci': '#e2e2e4',

        // Primary — near-black
        primary: '#030304',
        'on-primary': '#ffffff',
        'primary-container': '#1d1d1f',
        'on-primary-container': '#868587',
        'inverse-primary': '#c8c6c8',

        // Secondary — Indigo (AI accent)
        secondary: '#4e45d5',
        'on-secondary': '#ffffff',
        'secondary-container': '#6860ef',
        'on-secondary-container': '#fffbff',

        // Tertiary — Deep violet
        tertiary: '#040018',
        'on-tertiary': '#ffffff',
        'tertiary-container': '#230062',
        'on-tertiary-container': '#8f73e0',

        // Error
        error: '#ba1a1a',
        'on-error': '#ffffff',
        'error-container': '#ffdad6',
        'on-error-container': '#93000a',

        // Fixed colors
        'primary-fixed': '#e4e2e4',
        'primary-fixed-dim': '#c8c6c8',
        'on-primary-fixed': '#1b1b1d',
        'on-primary-fixed-variant': '#474649',
        'secondary-fixed': '#e3dfff',
        'secondary-fixed-dim': '#c3c0ff',
        'on-secondary-fixed': '#100069',
        'on-secondary-fixed-variant': '#372abf',
        'tertiary-fixed': '#e8ddff',
        'tertiary-fixed-dim': '#cebdff',
        'on-tertiary-fixed': '#21005e',
        'on-tertiary-fixed-variant': '#4f319c',

        // Brand-specific
        'space-gray': '#1D1D1F',
        'indigo-depth': '#4338CA',
        'soft-violet': '#C4B5FD',

        // Glassmorphism
        'glass-white': 'rgba(255, 255, 255, 0.7)',
        'hairline-border': 'rgba(0, 0, 0, 0.08)',

        // Status
        'status-success': '#10B981',
        'status-error': '#EF4444',
        'status-warning': '#F59E0B',

        // Legacy compatibility (mapped to new system)
        ai: {
          50: '#e3dfff',
          100: '#e8ddff',
          200: '#cebdff',
          400: '#8f73e0',
          500: '#6860ef',
          600: '#4e45d5',
          700: '#372abf',
        },
        slate: {
          50: '#f9f9fb',
          100: '#f3f3f5',
          200: '#e2e2e4',
          300: '#c7c6ca',
          400: '#77767b',
          500: '#5f5e60',
          600: '#46464a',
          700: '#2f3132',
          800: '#1a1c1d',
          900: '#030304',
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'system-ui', 'sans-serif'],
        mono: ['"Courier Prime"', 'monospace'],
      },
      fontSize: {
        'display': ['64px', { lineHeight: '72px', fontWeight: '700', letterSpacing: '-0.02em' }],
        'headline-lg': ['32px', { lineHeight: '40px', fontWeight: '600', letterSpacing: '-0.01em' }],
        'headline-md': ['24px', { lineHeight: '32px', fontWeight: '600' }],
        'body-lg': ['18px', { lineHeight: '28px', fontWeight: '400' }],
        'body-md': ['16px', { lineHeight: '24px', fontWeight: '400' }],
        'label-sm': ['12px', { lineHeight: '16px', fontWeight: '600', letterSpacing: '0.05em' }],
      },
      borderRadius: {
        sm: '0.25rem',
        DEFAULT: '0.5rem',
        md: '0.75rem',
        lg: '1rem',
        xl: '1.5rem',
        full: '9999px',
      },
      maxWidth: {
        'container-max': '1440px',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-8px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        }
      }
    },
  },
  plugins: [],
}
