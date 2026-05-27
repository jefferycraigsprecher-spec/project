import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#fff5f7',
          100: '#ffeef3',
          200: '#ffd0dd',
          300: '#ff9db5',
          400: '#f26a86',
          500: '#7b113a',
          600: '#660f2f',
          700: '#4e0b24',
          800: '#39081a',
          900: '#220511',
        },
        navy: {
          50:  '#f0f4ff',
          100: '#e0e9ff',
          200: '#c7d7fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#1e3a5f',
          600: '#1a3356',
          700: '#162b4a',
          800: '#12233d',
          900: '#0e1b30',
        }
      },
      fontFamily: {
        sans: ['var(--font-barlow)', 'system-ui', 'sans-serif'],
        display: ['var(--font-oswald)', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in':   'fadeIn 0.6s ease-out forwards',
        'slide-up':  'slideUp 0.6s ease-out forwards',
        'slide-in':  'slideIn 0.5s ease-out forwards',
        'pulse-slow': 'pulse 3s infinite',
      },
      keyframes: {
        fadeIn:  { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp: { from: { opacity: '0', transform: 'translateY(30px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        slideIn: { from: { opacity: '0', transform: 'translateX(-20px)' }, to: { opacity: '1', transform: 'translateX(0)' } },
      }
    },
  },
  plugins: [],
}

export default config