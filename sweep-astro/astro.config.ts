import { defineConfig } from 'astro/config';
import type { AstroUserConfig } from 'astro/config';
import vercel from '@astrojs/vercel/serverless';
import tailwind from '@astrojs/tailwind';
import icon from 'astro-icon';
import { defaultLocale, locales } from './src/i18n/config';

const serverConfig = {
  output: 'server',
  adapter: vercel(),
} satisfies AstroUserConfig;

const staticConfig = {
  output: 'static',
} satisfies AstroUserConfig;

// https://astro.build/config
export default defineConfig({
  ...(process.env.PUBLIC_APP_ENV === 'development'
    ? serverConfig
    : staticConfig),
  i18n: {
    defaultLocale,
    locales: [...locales],
  },
  image: {
    domains: ['sweep.flyhigh.pro'],
  },
  integrations: [
    icon({
      iconDir: 'src/assets/icons',
    }),
    tailwind({
      nesting: true,
    }),
  ],
});
