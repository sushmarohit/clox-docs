/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        clox: {
          navy: '#1A2F4C',
          orange: '#FF560E',
          surface: '#F8FAFC',
        },
      },
    },
  },
  plugins: [],
};

