const defaultTheme = require('tailwindcss/defaultTheme')

/** @type {import('tailwindcss').Config} */
export default {
  important: true, // Problem with TailwindCSS inline styles in SSR. See :TailwindCSS!Problem
  content: [],
  theme: {
    fontFamily: {
      mono: ['"Noto Sans Mono"', ...defaultTheme.fontFamily.sans],
    },
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '1.5rem',
      },
    },
    screens: {
      sm: '576px',
      md: '768px',
      lg: '992px',
      xl: '1248px',
    },
    extend: {
      colors: {
        primary: '#3558a2',
      },
    },
  },
  plugins: [],
}
