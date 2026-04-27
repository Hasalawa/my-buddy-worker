/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          green: '#00cc44',
          dark: '#121212',
          gray: '#242424'
        }
      },
      backgroundImage: {
        'wave-pattern': "url('/wave-bg.svg')",
      }
    },
  },
  plugins: [],
}