/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'd6g': {
          dark:    '#0D291C',
          green:   '#299261',
          lime:    '#7FD344',
          gray:    '#232B3A',
          night:   '#0a0d10',
          surface: '#f0faf4',
          border:  '#e8f5e9',
          muted:   '#EAEAEA',
        },
      },
    },
  },
  plugins: [require("flowbite/plugin")],
};
