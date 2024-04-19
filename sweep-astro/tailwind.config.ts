import type { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';
import defaultTheme from 'tailwindcss/defaultTheme';

export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  corePlugins: {
    container: false,
  },
  theme: {
    extend: {
      fontFamily: {
        sans: ['"MaisonNeue"', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        sw: {
          sky: {
            400: '#283FFF',
            500: '#0010A3',
          },
          sea: {
            500: '#052561',
          },
          fire: {
            400: '#FF4D2A',
          },
          surface: {
            subdued: '#F9F9F9',
            background: '#F2F2F2',
          },
          border: '#E0E0E0',
          text: {
            disabled: '#BDBDBD',
            subdued: '#6E6E6E',
          },
        },
      },
      spacing: {
        '4.5': '1.125rem',
        15: '3.75rem',
        18: '4.5rem',
        25: '6.25rem',
      },
      screens: {
        xs: '376px',
      },
      boxShadow: {
        button:
          '0px -1px 0px 0px rgb(0 0 0 / 0.2) inset, 0px 1px 0px 0px rgb(0 0 0 / 0.08)',
        'button-secondary': '0px 1px 0px 0px rgb(0 0 0 / 0.03)',
        'language-switcher': '0px 0px 7px 0px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [
    plugin(({ addComponents, theme }) => {
      addComponents({
        '.typography-h1': {
          fontSize: '4.375rem',
          lineHeight: theme('lineHeight.tight'),
          fontWeight: theme('fontWeight.bold'),
          color: theme('colors.black'),
          textWrap: 'balance',
        },
        '.typography-h2': {
          fontSize: '2.5rem',
          lineHeight: theme('lineHeight.snug'),
          fontWeight: theme('fontWeight.bold'),
          color: theme('colors.black'),
          textWrap: 'balance',
        },
        '.typography-h3': {
          fontSize: '2rem',
          lineHeight: theme('lineHeight.tight'),
          fontWeight: theme('fontWeight.bold'),
          color: theme('colors.black'),
          textWrap: 'balance',
        },
        '.typography-h4': {
          fontSize: theme('fontSize.2xl'),
          lineHeight: theme('lineHeight.8'),
          fontWeight: theme('fontWeight.bold'),
          color: theme('colors.black'),
          textWrap: 'balance',
        },
        '.typography-subhead': {
          fontSize: theme('fontSize.base'),
          lineHeight: theme('lineHeight.6'),
          fontWeight: theme('fontWeight.medium'),
          color: theme('colors.sw.text.subdued'),
        },
        '.typography-body': {
          fontSize: theme('fontSize.lg'),
          lineHeight: theme('lineHeight.7'),
          fontWeight: theme('fontWeight.normal'),
          color: theme('colors.sw.text.subdued'),
        },
        '.typography-body-2': {
          fontSize: theme('fontSize.base'),
          lineHeight: theme('lineHeight.6'),
          fontWeight: theme('fontWeight.medium'),
          color: theme('colors.black'),
        },
        '.typography-body-large': {
          fontSize: theme('fontSize.xl'),
          lineHeight: theme('lineHeight.7'),
          color: theme('colors.black'),
        },
        '.typography-cards-bold-large': {
          fontSize: theme('fontSize.2xl'),
          lineHeight: theme('lineHeight.8'),
          fontWeight: theme('fontWeight.bold'),
          color: theme('colors.black'),
        },
        '.typography-card-title': {
          fontSize: theme('fontSize.base'),
          lineHeight: theme('lineHeight.6'),
          fontWeight: theme('fontWeight.medium'),
          color: theme('colors.black'),
          textTransform: 'uppercase',
        },
      });
    }),
  ],
} satisfies Config;
