import conference from './public/data/conference.json';

const radius = {
  small: '0.125rem',
  medium: '0.25rem',
  large: '0.5rem',
  full: '9999px',
};

const shadow = {
  small: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  default: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  medium: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  large: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
};

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    fontFamily: {
      primary: [ conference.design.font, 'sans-serif' ],
      secondary: [ '"Open Sans"', 'sans-serif' ],
    },
    extend: {
      colors: {
        'primary-color': conference.design.primaryColour,
        'secondary-color': conference.design.secondaryColour,
      },
      borderRadius: {
        DEFAULT: radius[conference.design.roundness],
      },
      boxShadow: {
        DEFAULT: shadow[conference.design.shadows]
      },
    },
  },
  plugins: [],
}

