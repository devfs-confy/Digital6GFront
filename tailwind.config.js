/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}", // Incluye todos los archivos Vue, JS, TS, etc.
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0D291C",
        secondary: "#232B3A",
        complementary: "#7FD344",
        tercero: "#299261",
        ultimate: "#0a0d10",
      },
    },
  },
  plugins: [require("flowbite/plugin")],
};
