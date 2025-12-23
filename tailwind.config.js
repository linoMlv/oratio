/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['ui-serif', 'Georgia', 'Cambria', "Times New Roman", 'Times', 'serif'],
        sans: ['ui-sans-serif', 'system-ui', 'sans-serif', "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"],
      },
      colors: {
        pastel: {
          red: '#fee2e2',
          blue: '#dbeafe',
          green: '#dcfce7',
          yellow: '#fef9c3',
          purple: '#f3e8ff',
          pink: '#fce7f3',
          indigo: '#e0e7ff',
          orange: '#ffedd5',
        }
      }
    },
  },
  plugins: [],
}
