import defaultTheme from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./app/**/*.tsx'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Geist', ...defaultTheme.fontFamily.sans],
        mono: ['Geist', ...defaultTheme.fontFamily.mono],
      },
      height: {
        header: 'var(--header-height)',
        footer: 'var(--footer-height)',
        'mobile-footer': 'var(--mobile-footer-height)',
      },
      colors: {
        primary: '#FFF7E6',
        'primary-faded': '#FFF7E660',
        'primary-bg': 'FFF7E608',
        secondary: '#939393',
        'secondary-faded': '#93939360',
        'secondary-bg': '#93939308',
      },
    },
  },
};
