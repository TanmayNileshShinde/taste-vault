/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        neu: {
          light: '#eef2f7',
          lightDark: '#dce3ec',
          dark: '#161922',
          darkSurface: '#1f2430',
          darkBorder: '#2b3242',
        }
      },
      boxShadow: {
        'neu-flat': '8px 8px 18px #d1d9e6, -8px -8px 18px #ffffff',
        'neu-flat-hover': '11px 11px 22px #c7d1e0, -11px -11px 22px #ffffff',
        'neu-pressed': 'inset 4px 4px 8px #d1d9e6, inset -4px -4px 8px #ffffff',
        'neu-sm': '4px 4px 10px #d4dce8, -4px -4px 10px #ffffff',
        'neu-sm-pressed': 'inset 2px 2px 5px #d4dce8, inset -2px -2px 5px #ffffff',
        // Dark mode shadows
        'neu-dark-flat': '7px 7px 16px #101219, -7px -7px 16px #242936',
        'neu-dark-hover': '9px 9px 20px #0d0f14, -9px -9px 20px #2a3040',
        'neu-dark-pressed': 'inset 4px 4px 8px #101219, inset -4px -4px 8px #262c3b',
        'neu-dark-sm': '3px 3px 8px #101219, -3px -3px 8px #242936',
        'neu-dark-sm-pressed': 'inset 2px 2px 4px #101219, inset -2px -2px 4px #262c3b',
      }
    },
  },
  plugins: [],
}
