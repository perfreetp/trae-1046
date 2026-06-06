/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        primary: {
          50: '#E8F3FF',
          100: '#BEDAFF',
          200: '#94BFFF',
          300: '#6AA1FF',
          400: '#4080FF',
          500: '#165DFF',
          600: '#0E42D2',
          700: '#0A2BA6',
          800: '#061A79',
          900: '#03104D',
        },
        success: {
          500: '#00B42A',
        },
        warning: {
          500: '#FF7D00',
        },
        danger: {
          500: '#F53F3F',
        },
      },
      fontFamily: {
        sans: ['Source Han Sans', 'Noto Sans SC', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
