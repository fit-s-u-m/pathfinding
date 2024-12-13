/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-color': {
          '50': '#f4f3fa',
          '100': '#e8e8f7',
          '200': '#d8d6ef',
          '300': '#c0bde4',
          '400': '#aba2d7',
          '500': '#9a8aca',
          '600': '#8971ba',
          '700': '#7660a2',
          '800': '#614f84',
          '900': '#554971',
          '950': '#2f283e',
        },
        'background-color': {
          '50': '#f8f8f8',
          '100': '#f2f1f1',
          '200': '#e7e4e6',
          '300': '#d3ced1',
          '400': '#bab2b6',
          '500': '#a2999e',
          '600': '#847a80',
          '700': '#6c6469',
          '800': '#5c555a',
          '900': '#514a4f',
          '950': '#2a2729',
        },

      },

    },
  },
  plugins: [
    require('daisyui'),
    require('@tailwindcss/forms')
  ],
}

        // "primary-color": "#554971",
        // "primary-color-light": "#BCD8B7",
        // "secondary-color": "#A2999E",
        // "accent-color": "#ff6380",
        // "background-color": "#C6C7C4",
        // "bold-color": "#000",
