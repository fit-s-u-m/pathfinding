/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        /* Gruvbox Primary (Yellow / Warm Brown) */
        'primary-color': {
          '50':  '#fbf1c7',
          '100': '#fae39c',
          '200': '#facc66',
          '300': '#d79921',
          '400': '#c5831f',
          '500': '#af791c',
          '600': '#926f34',
          '700': '#786634',
          '800': '#665c54',
          '900': '#504945',
          '950': '#32302f',
        },

        /* Gruvbox Background Scale */
        'background-color': {
          '50':  '#fbf1c7', // bg0_soft
          '100': '#ebdbb2', // fg1
          '200': '#d5c4a1', // fg2
          '300': '#bdae93', // fg3
          '400': '#a89984', // fg4
          '500': '#928374',
          '600': '#7c6f64',
          '700': '#665c54',
          '800': '#3c3836', // bg1
          '900': '#282828', // bg0
          '950': '#1d2021', // bg0_hard
        },
      },
    },
  },
  plugins: [
    require('daisyui'),
    require('@tailwindcss/forms')
  ],
}
