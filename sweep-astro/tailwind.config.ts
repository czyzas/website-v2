import type { Config } from 'tailwindcss';
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
    },
  },
  plugins: [],
} satisfies Config;
