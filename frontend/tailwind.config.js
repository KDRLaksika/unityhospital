/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          600: '#2563eb', // Corporate blue
          700: '#1d4ed8',
        },
        background: '#f4f7f6',
      },
      fontFamily: {
        sans: ['Roboto', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 2px 4px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.03)',
        'btn': '0 1px 2px rgba(0, 0, 0, 0.05)',
      },
      borderRadius: {
        'md': '8px',
        'lg': '12px',
      }
    },
  },
  plugins: [],
}

