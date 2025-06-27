/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./frontend/src/**/*.{js,ts,jsx,tsx}",
    "./folder1/frontend/src/**/*.{js,ts,jsx,tsx}",
    "./folder2/client/src/**/*.{js,ts,jsx,tsx}",
    "./folder3/client/src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#4a6cf7",
        secondary: "#ff6c4a",
      },
    },
  },
  plugins: [],
};
