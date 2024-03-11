import type { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';
import defaultTheme from 'tailwindcss/defaultTheme';

export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"MaisonNeue"', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        sw: {
          action: {
            primary: '#283FFF',
          },
          sky: {
            400: '#283FFF',
            500: '#0010A3',
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
      boxShadow: {
        button:
          '0px -1px 0px 0px rgb(0 0 0 / 0.2) inset, 0px 1px 0px 0px rgb(0 0 0 / 0.08)',
        'button-secondary': '0px 1px 0px 0px rgb(0 0 0 / 0.03)',
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
          fontWeight: theme('fontWeight.semibold'),
          color: theme('colors.sw.text.subdued'),
        },
        '.typography-body': {
          fontSize: theme('fontSize.lg'),
          lineHeight: theme('lineHeight.7'),
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
          color: theme('colors.black'),
          fontWeight: theme('fontWeight.bold'),
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
