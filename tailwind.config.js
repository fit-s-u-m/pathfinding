/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary-color": "#554971",
        "primary-color-light": "#BCD8B7",
        "secondary-color": "#A2999E",
        "accent-color": "#ff6380",
        "background-color": "#C6C7C4",
        "bold-color": "#000",
      },

    },
  },
  plugins: [
    require('daisyui'),
    require('@tailwindcss/forms')
  ],
}

