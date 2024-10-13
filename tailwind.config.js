/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3498DB',
        secondary: '#F7F7F7',
        Accent: '#2ECC71',
        text: '#333333',
        error: '#FFC080',
        sucess: '#8BC34A',
        warning: '#FFA07A'
      },
    },
  },
  plugins: [],
}

