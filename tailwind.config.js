/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        binance: {
          bg: '#1E2329',
          black: '#0B0E11',
          primary: '#FCD535',
          text: '#EAECEF',
          secondary: '#707A8A',
          green: '#2EBD85',
          red: '#F6465D',
          hover: '#2B3139',
        }
      },
      backgroundImage: {
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0) 100%)',
      },
      backdropBlur: {
        'xs': '2px',
      }
    },
  },
  plugins: [],
}
