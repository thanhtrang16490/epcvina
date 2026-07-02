/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#175ead',
          50: '#e6f2ff',
          100: '#b3d9ff',
          200: '#80c0ff',
          300: '#4da7ff',
          400: '#1a8eff',
          500: '#175ead',
          600: '#124a8a',
          700: '#0d3767',
          800: '#082444',
          900: '#031121',
        },
      },
    },
  },
  plugins: [],
}
