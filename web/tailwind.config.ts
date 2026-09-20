import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      screens: {
        // Large Retina / 5K logical widths (e.g. 27" iMac ~2560 CSS px)
        '3xl': '1920px',
      },
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
        'about-float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-15px)' },
        },
        'about-truck-bg': {
          '0%': { transform: 'translateX(-150px)' },
          '100%': { transform: 'translateX(110vw)' },
        },
        'about-truck-scroll': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(110vw)' },
        },
        'about-tab-in': {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'hero-fade-up': 'hero-fade-up 1s ease-out',
        'about-float': 'about-float 6s ease-in-out infinite',
        'about-float-delayed': 'about-float 6s ease-in-out -3s infinite',
        'about-truck-bg': 'about-truck-bg 25s linear infinite',
        'about-truck-scroll': 'about-truck-scroll 14s linear infinite',
        'about-tab-in': 'about-tab-in 0.5s ease-out forwards',
      },
    },
  },
  plugins: [],
};

export default config;
