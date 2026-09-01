/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        cream: '#FBF6EE',
        shell: '#FFFFFF',
        ink: '#2B1810',
        line: '#E7D7BE',
        // Vino/dorado — la paleta de la portada "Sabores de España".
        wine: {
          50: '#FBF0EF',
          100: '#F2D6D3',
          200: '#E0A8A2',
          300: '#C97169',
          400: '#A8433A',
          500: '#7A2620',
          600: '#5E1D18',
          700: '#4A1712',
          800: '#3A120E',
          900: '#2C0D0A',
        },
        gold: {
          50: '#FDF8EC',
          100: '#F9EBC5',
          200: '#F1D385',
          300: '#E6B84E',
          400: '#D8A02F',
          500: '#BD861F',
          600: '#966A18',
          700: '#734F12',
        },
      },
      boxShadow: {
        card: '0 1px 2px rgba(43,24,16,0.05), 0 8px 24px -14px rgba(43,24,16,0.25)',
        lift: '0 14px 34px -16px rgba(43,24,16,0.35)',
      },
      backgroundImage: {
        'wine-gradient': 'linear-gradient(135deg, #5E1D18 0%, #7A2620 55%, #4A1712 100%)',
      },
    },
  },
  plugins: [],
}
