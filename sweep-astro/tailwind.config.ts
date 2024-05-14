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
          surface: {
            subdued: '#F9F9F9',
            background: '#F2F2F2',
          },
          border: '#E0E0E0',
          text: {
            disabled: '#BDBDBD',
            subdued: '#6E6E6E',
          },
          action: {
            destructive: '#D32F2F',
          },
          gray: {
            100: '#F9F9F9',
            200: '#F2F2F2',
            300: '#E0E0E0',
            400: '#BDBDBD',
            500: '#8A8A8A',
            600: '#6E6E6E',
            700: '#4D4D4D',
          },
          sky: {
            100: '#E3E7FB',
            200: '#B4BDEA',
            300: '#7E8CFF',
            400: '#283FFF',
            500: '#0010A3',
          },
          fire: {
            100: '#FCE6E2',
            200: '#FFC7BC',
            300: '#FF927F',
            400: '#FF4D2A',
            500: '#B81F00',
          },
          crop: {
            100: '#FFF4D7',
            200: '#FFE794',
            300: '#FFD439',
            400: '#EBB900',
            500: '#9A6500',
          },
          grass: {
            100: '#DDF3D8',
            200: '#B7E6AB',
            300: '#95DB83',
            400: '#1AC734',
            500: '#008113',
          },
          algea: {
            100: '#D9F2E5',
            200: '#A4DFC2',
            300: '#68CA99',
            400: '#0B895F',
            500: '#22543B',
          },
          glacier: {
            100: '#E6F0F4',
            200: '#BBE5F5',
            300: '#91DBF8',
            400: '#1FC0FF',
            500: '#0192CB',
          },
          sea: {
            100: '#DFE5F1',
            200: '#ADBCD7',
            300: '#6D88BA',
            400: '#073792',
            500: '#052561',
          },
          flower: {
            100: '#E7D6F1',
            200: '#D3B0E6',
            300: '#A977DD',
            400: '#7419A4',
            500: '#4B0F6C',
          },
          coral: {
            100: '#F4E2F0',
            200: '#EBC2E2',
            300: '#D682DC',
            400: '#AF32B8',
            500: '#732178',
          },
        },
      },
      backgroundImage: {
        'menu-split':
          'linear-gradient(90deg, #fff 50% , #E0E0E0 50%, #E0E0E0 calc(50% + 1px),  #fff calc(50% + 1px), #fff 100%)',
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
        menu: '0px 0px 20px 0px rgba(0, 0, 0, 0.1)',
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
        '.typography-number-stats': {
          fontSize: theme('fontSize.6xl'),
          lineHeight: theme('lineHeight.snug'),
          fontWeight: theme('fontWeight.semibold'),
          color: theme('colors.sw.sky.400'),
        },
        '.typography-large-quote': {
          fontSize: '1.625rem',
          lineHeight: theme('lineHeight.snug'),
        },
      });
    }),
  ],
} satisfies Config;
