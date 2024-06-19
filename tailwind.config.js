/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')
import color from 'color'
const darken = (clr, val) => color(clr).darken(val).rgb().string()

module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'gooner-red': '#ff0000',
        'gooner-red-dark': darken('#ff0000', 0.5),
      },
      fontFamily: {
        sans: ['"Inter"', ...defaultTheme.fontFamily.sans],
      },
      keyframes: {
        'glitch-anim-1': {
          '0%': {
            clipPath: 'polygon(0 0%, 100% 0%, 100% 5%, 0 5%)',
          },
          '10%': {
            clipPath: 'polygon(0 15%, 100% 15%, 100% 15%, 0 15%)',
          },
          '20%': {
            clipPath: 'polygon(0 10%, 100% 10%, 100% 20%, 0 20%)',
          },
          '30%': {
            clipPath: 'polygon(0 1%, 100% 1%, 100% 2%, 0 2%)',
          },
          '40%': {
            clipPath: 'polygon(0 35%, 100% 35%, 100% 35%, 0 35%)',
          },
          '50%': {
            clipPath: 'polygon(0 45%, 100% 45%, 100% 46%, 0 46%)',
          },
          '60%': {
            clipPath: 'polygon(0 50%, 100% 50%, 100% 70%, 0 70%)',
          },
          '70%': {
            clipPath: 'polygon(0 70%, 100% 70%, 100% 70%, 0 70%)',
          },
          '80%': {
            clipPath: 'polygon(0 80%, 100% 80%, 100% 80%, 0 80%)',
          },
          '90%': {
            clipPath: 'polygon(0 50%, 100% 50%, 100% 55%, 0 55%)',
          },
          '100%': {
            clipPath: 'polygon(0 60%, 100% 60%, 100% 70%, 0 70%)',
          },
        },
        'glitch-anim-2': {
          '0%': {
            clipPath: 'polygon(0 15%, 100% 15%, 100% 30%, 0 30%)',
          },
          '15%': {
            clipPath: 'polygon(0 3%, 100% 3%, 100% 3%, 0 3%)',
          },
          '25%': {
            clipPath: 'polygon(0 8%, 100% 8%, 100% 20%, 0 20%)',
          },
          '30%': {
            clipPath: 'polygon(0 20%, 100% 20%, 100% 20%, 0 20%)',
          },
          '45%': {
            clipPath: 'polygon(0 45%, 100% 45%, 100% 45%, 0 45%)',
          },
          '50%': {
            clipPath: 'polygon(0 50%, 100% 50%, 100% 57%, 0 57%)',
          },
          '65%': {
            clipPath: 'polygon(0 60%, 100% 60%, 100% 60%, 0 60%)',
          },
          '75%': {
            clipPath: 'polygon(0 80%, 100% 80%, 100% 80%, 0 80%)',
          },
          '80%': {
            clipPath: 'polygon(0 40%, 100% 40%, 100% 60%, 0 60%)',
          },
          '95%': {
            clipPath: 'polygon(0 45%, 100% 45%, 100% 60%, 0 60%)',
          },
          '100%': {
            clipPath: 'polygon(0 11%, 100% 11%, 100% 15%, 0 15%)',
          },
        },
        'glitch-anim-flash': {
          '0%': {
            opacity: 0.2,
          },
          '30%, 100%': {
            opacity: 0,
          },
        },
      },
      animation: {
        'glitch-anim-1': 'glitch-anim-1 2s infinite linear alternate',
        'glitch-anim-2': 'glitch-anim-2 2.3s -0.8s infinite linear alternate',
        'glitch-anim-flash': 'glitch-anim-flash 1s infinite linear',
      },
    },
  },
  plugins: [],
}
