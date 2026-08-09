import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        clox: {
          navy: '#0A1F3C',
          orange: '#FF560E',
          blue: '#133A6B',
          surface: '#F8FAFC',
          ink: '#2C3E50',
        },
      },
      fontFamily: {
        sans: [
          'var(--font-poppins)',
          'var(--font-noto-devanagari)',
          'Poppins',
          'Noto Sans Devanagari',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica',
          'Arial',
          'sans-serif',
        ],
      },
      boxShadow: {
        'clox-orange': '0 8px 25px rgba(255, 86, 14, 0.45)',
        'clox-card': '0 20px 40px rgba(0, 0, 0, 0.12)',
      },
      keyframes: {
        'hero-fade-up': {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'hero-fade-up': 'hero-fade-up 1s ease-out',
      },
    },
  },
  plugins: [],
};

export default config;
