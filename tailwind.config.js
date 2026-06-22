/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./context/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Dark mode colors
        navy: {
          DEFAULT: '#0D1B2A',
          light: '#1B2B3B',
          lighter: '#243447',
        },
        gold: {
          DEFAULT: '#F5A623',
          light: '#F7B84B',
          dark: '#D4911F',
        },
        // Light mode colors
        cream: {
          DEFAULT: '#FDF6E3',
          dark: '#F5E6C8',
        },
        burgundy: {
          DEFAULT: '#800020',
          light: '#9B0025',
        },
        brown: {
          DEFAULT: '#4A2C2A',
          light: '#6B3F3C',
        },
      },
      fontFamily: {
        serif: ['Georgia', 'Cambria', 'Times New Roman', 'serif'],
        sans: ['Geist', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};