/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#252423',
        ink: 'rgb(var(--ink) / <alpha-value>)',
        paper: 'rgb(var(--paper) / <alpha-value>)',
        gold: 'rgb(var(--gold) / <alpha-value>)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        shine: 'shine 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        shine: {
          '0%': { transform: 'translateX(-100%) skewX(-12deg)', opacity: '0' },
          '20%': { opacity: '1' },
          '100%': { transform: 'translateX(100%) skewX(-12deg)', opacity: '0' },
        },
      },
    },
  },
  plugins: [],
}
