/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        cream: '#FBF6EF',
        ink: '#241C15',
        brand: {
          50: '#FFF3EC',
          100: '#FFE4D3',
          200: '#FFC7A3',
          300: '#FFA26B',
          400: '#FA7D3C',
          500: '#EE5A24',
          600: '#DC4A17',
          700: '#B83A12',
          800: '#8F2D0F',
          900: '#6E230C',
        },
      },
      boxShadow: {
        card: '0 1px 2px rgba(36,28,21,0.04), 0 8px 24px -12px rgba(36,28,21,0.12)',
        soft: '0 1px 3px rgba(36,28,21,0.06)',
      },
      borderRadius: {
        xl2: '1.25rem',
      },
    },
  },
  plugins: [],
}
