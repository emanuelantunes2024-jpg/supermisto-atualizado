import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#FFF4ED',
          100: '#FFE6D5',
          200: '#FFCBA8',
          300: '#FFA870',
          400: '#FB7E3C',
          500: '#F2600C',
          600: '#E14E0A',
          700: '#B93D0B',
          800: '#933110',
          900: '#772A10',
        },
        ink: {
          900: '#15151B',
          800: '#1C1C24',
          700: '#25252F',
          600: '#33333F',
        },
        cream: '#FBF6F0',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(20,20,30,0.04), 0 8px 24px -12px rgba(20,20,30,0.12)',
      },
    },
  },
  plugins: [],
} satisfies Config;
