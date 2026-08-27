/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        cream: '#FAF6F1',
        shell: '#FFFFFF',
        ink: '#2B2118',
        line: '#DCC9AF',
        brand: {
          50: '#FFF2EC',
          100: '#FFE2D5',
          200: '#FFC4AA',
          300: '#FFA079',
          400: '#FB7E4B',
          500: '#F2571F',
          600: '#DE4712',
          700: '#B8380C',
          800: '#8E2B09',
          900: '#6C2107',
        },
      },
      boxShadow: {
        card: '0 1px 2px rgba(43,33,24,0.04), 0 6px 20px -14px rgba(43,33,24,0.18)',
        soft: '0 1px 3px rgba(43,33,24,0.06)',
        lift: '0 10px 30px -14px rgba(43,33,24,0.28)',
      },
    },
  },
  plugins: [],
}
