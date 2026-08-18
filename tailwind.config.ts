// PATH: tailwind.config.ts
// Tailwind CSS v3 configuration
// Extends shadcn/ui CSS variable convention for seamless theming

import type { Config } from 'tailwindcss'
import typography from '@tailwindcss/typography'

const config: Config = {
  // Use 'class' strategy — toggled by adding/removing 'dark' class on <html>
  darkMode: 'class',

  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
    // Include shadcn/ui generated components
    './src/shared/ui/shadcn/**/*.{ts,tsx}',
  ],

  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      // ─── Font ─────────────────────────────────────────────────────────────
      fontFamily: {
        // Hỗ trợ Public Sans (theo quy chuẩn BCA) và Inter làm fallback
        sans: ['var(--font-sans)', 'Public Sans', 'Inter', 'system-ui', 'sans-serif'],
      },

      // ─── shadcn/ui & Stitch Color Convention (CSS variables → Tailwind classes) ────
      // All colors are defined as CSS variables in globals.scss
      // Convention: --{name} → hsl(var(--{name}))
      colors: {
        border: 'hsl(var(--border) / <alpha-value>)',
        'color-table': 'hsl(var(--border-color-table) / <alpha-value>)',
        input: 'hsl(var(--input) / <alpha-value>)',
        ring: 'hsl(var(--ring) / <alpha-value>)',
        outline: 'hsl(var(--outline) / <alpha-value>)',
        'outline-variant': 'hsl(var(--outline-variant) / <alpha-value>)',
        background: 'hsl(var(--background) / <alpha-value>)',
        foreground: 'hsl(var(--foreground) / <alpha-value>)',

        /* Primary (Đỏ BCA) */
        primary: {
          DEFAULT: 'hsl(var(--primary) / <alpha-value>)',
          foreground: 'hsl(var(--primary-foreground) / <alpha-value>)',
          container: 'hsl(var(--primary-container) / <alpha-value>)',
          'on-container': 'hsl(var(--on-primary-container) / <alpha-value>)',
          fixed: 'hsl(var(--primary-fixed) / <alpha-value>)',
          'fixed-dim': 'hsl(var(--primary-fixed-dim) / <alpha-value>)',
          'on-fixed': 'hsl(var(--on-primary-fixed) / <alpha-value>)',
          'on-fixed-variant': 'hsl(var(--on-primary-fixed-variant) / <alpha-value>)',
          inverse: 'hsl(var(--inverse-primary) / <alpha-value>)',
        },
        'primary-container': 'hsl(var(--primary-container) / <alpha-value>)',
        'on-primary-container': 'hsl(var(--on-primary-container) / <alpha-value>)',
        'primary-fixed': 'hsl(var(--primary-fixed) / <alpha-value>)',
        'primary-fixed-dim': 'hsl(var(--primary-fixed-dim) / <alpha-value>)',
        'on-primary-fixed': 'hsl(var(--on-primary-fixed) / <alpha-value>)',
        'on-primary-fixed-variant': 'hsl(var(--on-primary-fixed-variant) / <alpha-value>)',
        'inverse-primary': 'hsl(var(--inverse-primary) / <alpha-value>)',

        /* Secondary (Xanh CAND) */
        secondary: {
          DEFAULT: 'hsl(var(--secondary) / <alpha-value>)',
          foreground: 'hsl(var(--secondary-foreground) / <alpha-value>)',
          container: 'hsl(var(--secondary-container) / <alpha-value>)',
          'on-container': 'hsl(var(--on-secondary-container) / <alpha-value>)',
          fixed: 'hsl(var(--secondary-fixed) / <alpha-value>)',
          'fixed-dim': 'hsl(var(--secondary-fixed-dim) / <alpha-value>)',
          'on-fixed': 'hsl(var(--on-secondary-fixed) / <alpha-value>)',
          'on-fixed-variant': 'hsl(var(--on-secondary-fixed-variant) / <alpha-value>)',
        },
        'secondary-container': 'hsl(var(--secondary-container) / <alpha-value>)',
        'on-secondary-container': 'hsl(var(--on-secondary-container) / <alpha-value>)',
        'secondary-fixed': 'hsl(var(--secondary-fixed) / <alpha-value>)',
        'secondary-fixed-dim': 'hsl(var(--secondary-fixed-dim) / <alpha-value>)',
        'on-secondary-fixed': 'hsl(var(--on-secondary-fixed) / <alpha-value>)',
        'on-secondary-fixed-variant': 'hsl(var(--on-secondary-fixed-variant) / <alpha-value>)',

        /* Tertiary (Xanh Chính Trực) */
        tertiary: {
          DEFAULT: 'hsl(var(--tertiary) / <alpha-value>)',
          foreground: 'hsl(var(--tertiary-foreground) / <alpha-value>)',
          container: 'hsl(var(--tertiary-container) / <alpha-value>)',
          'on-container': 'hsl(var(--on-tertiary-container) / <alpha-value>)',
          fixed: 'hsl(var(--tertiary-fixed) / <alpha-value>)',
          'fixed-dim': 'hsl(var(--tertiary-fixed-dim) / <alpha-value>)',
          'on-fixed': 'hsl(var(--on-tertiary-fixed) / <alpha-value>)',
          'on-fixed-variant': 'hsl(var(--on-tertiary-fixed-variant) / <alpha-value>)',
        },
        'tertiary-container': 'hsl(var(--tertiary-container) / <alpha-value>)',
        'on-tertiary-container': 'hsl(var(--on-tertiary-container) / <alpha-value>)',
        'tertiary-fixed': 'hsl(var(--tertiary-fixed) / <alpha-value>)',
        'tertiary-fixed-dim': 'hsl(var(--tertiary-fixed-dim) / <alpha-value>)',
        'on-tertiary-fixed': 'hsl(var(--on-tertiary-fixed) / <alpha-value>)',
        'on-tertiary-fixed-variant': 'hsl(var(--on-tertiary-fixed-variant) / <alpha-value>)',

        /* Surfaces & Muted */
        surface: 'hsl(var(--surface) / <alpha-value>)',
        'surface-bright': 'hsl(var(--surface-bright) / <alpha-value>)',
        'surface-dim': 'hsl(var(--surface-dim) / <alpha-value>)',
        'surface-tint': 'hsl(var(--surface-tint) / <alpha-value>)',
        'surface-variant': 'hsl(var(--surface-variant) / <alpha-value>)',
        'on-surface-variant': 'hsl(var(--on-surface-variant) / <alpha-value>)',
        'surface-container': 'hsl(var(--surface-container) / <alpha-value>)',
        'surface-container-low': 'hsl(var(--surface-container-low) / <alpha-value>)',
        'surface-container-high': 'hsl(var(--surface-container-high) / <alpha-value>)',
        'surface-container-highest': 'hsl(var(--surface-container-highest) / <alpha-value>)',
        'surface-container-lowest': 'hsl(var(--surface-container-lowest) / <alpha-value>)',
        'inverse-surface': 'hsl(var(--inverse-surface) / <alpha-value>)',
        'inverse-on-surface': 'hsl(var(--inverse-on-surface) / <alpha-value>)',

        destructive: {
          DEFAULT: 'hsl(var(--destructive) / <alpha-value>)',
          foreground: 'hsl(var(--destructive-foreground) / <alpha-value>)',
        },
        error: 'hsl(var(--error) / <alpha-value>)',
        'error-container': 'hsl(var(--error-container) / <alpha-value>)',
        'on-error-container': 'hsl(var(--on-error-container) / <alpha-value>)',

        success: {
          DEFAULT: 'hsl(var(--success) / <alpha-value>)',
          foreground: 'hsl(var(--success-foreground) / <alpha-value>)',
        },
        warning: {
          DEFAULT: 'hsl(var(--warning) / <alpha-value>)',
          foreground: 'hsl(var(--warning-foreground) / <alpha-value>)',
        },
        info: {
          DEFAULT: 'hsl(var(--info) / <alpha-value>)',
          foreground: 'hsl(var(--info-foreground) / <alpha-value>)',
        },

        muted: {
          DEFAULT: 'hsl(var(--muted) / <alpha-value>)',
          foreground: 'hsl(var(--muted-foreground) / <alpha-value>)',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent) / <alpha-value>)',
          foreground: 'hsl(var(--accent-foreground) / <alpha-value>)',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover) / <alpha-value>)',
          foreground: 'hsl(var(--popover-foreground) / <alpha-value>)',
        },
        card: {
          DEFAULT: 'hsl(var(--card) / <alpha-value>)',
          foreground: 'hsl(var(--card-foreground) / <alpha-value>)',
        },

        'brand-red': 'hsl(var(--brand-red) / <alpha-value>)',
        'brand-red-hover': 'hsl(var(--brand-red-hover) / <alpha-value>)',
        'brand-red-foreground': 'hsl(var(--brand-red-foreground) / <alpha-value>)',
        'brand-orange': 'hsl(var(--brand-orange) / <alpha-value>)',
        'brand-gold': 'hsl(var(--brand-gold) / <alpha-value>)',

        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background) / <alpha-value>)',
          foreground: 'hsl(var(--sidebar-foreground) / <alpha-value>)',
          primary: 'hsl(var(--sidebar-primary) / <alpha-value>)',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground) / <alpha-value>)',
          accent: 'hsl(var(--sidebar-accent) / <alpha-value>)',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground) / <alpha-value>)',
          border: 'hsl(var(--sidebar-border) / <alpha-value>)',
          ring: 'hsl(var(--sidebar-ring) / <alpha-value>)',
        },
      },

      // ─── Border Radius via CSS variable ──────────────────────────────────
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },

      // ─── Custom Animations ─────────────────────────────────────────────────
      keyframes: {
        // Accordion animations (used by shadcn/ui Accordion)
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        // Fade-in animation for page transitions
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        // Slide-up for modals/dialogs
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        // Skeleton pulse (loading state)
        'skeleton-pulse': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.4' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.3s ease-out',
        'slide-up': 'slide-up 0.3s ease-out',
        'skeleton-pulse': 'skeleton-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },

  plugins: [typography],
}

export default config
