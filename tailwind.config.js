/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#0f1117',
          secondary: '#161b27',
          tertiary: '#1e2435',
          card: '#1a1f2e',
          hover: '#222840',
        },
        accent: {
          blue: '#3b82f6',
          yellow: '#facc15',
          green: '#22c55e',
          red: '#ef4444',
          purple: '#a855f7',
        },
        level: {
          beginner: '#22c55e',
          intermediate: '#facc15',
          advanced: '#3b82f6',
          expert: '#ef4444',
          mastery: '#a855f7',
        },
        border: {
          subtle: '#2a3040',
          default: '#3a4155',
          strong: '#4a5168',
        },
        text: {
          primary: '#e8eaf0',
          secondary: '#9ca3af',
          muted: '#6b7280',
          code: '#a5d6ff',
        },
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'Consolas', 'monospace'],
        serif: ['Lora', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'dot-pattern': 'radial-gradient(circle, #2a3040 1px, transparent 1px)',
        'grid-pattern':
          'linear-gradient(rgba(42,48,64,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(42,48,64,0.4) 1px, transparent 1px)',
      },
      backgroundSize: {
        'dot-sm': '24px 24px',
        'grid-md': '40px 40px',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 8s linear infinite',
        'float': 'float 6s ease-in-out infinite',
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
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      boxShadow: {
        'card': '0 4px 24px rgba(0,0,0,0.4)',
        'card-hover': '0 8px 40px rgba(0,0,0,0.6)',
        'glow-blue': '0 0 20px rgba(59,130,246,0.3)',
        'glow-yellow': '0 0 20px rgba(250,204,21,0.3)',
        'glow-green': '0 0 20px rgba(34,197,94,0.3)',
      },
    },
  },
  plugins: [],
}
