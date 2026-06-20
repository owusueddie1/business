import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        aura: {
          navy: '#0A2540',
          gold: '#D4AF37',
          surface: '#F8F9FA',
        },
      },
      boxShadow: {
        soft: '0 20px 50px rgba(10, 37, 64, 0.08)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Sora', 'Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
