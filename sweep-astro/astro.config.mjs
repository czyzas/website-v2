import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel/serverless';
import { defaultLocale, locales } from './src/i18n/config';

const serverConfig = {
  output: 'server',
  adapter: vercel(),
};

const staticConfig = {
  output: 'static',
};

export default defineConfig({
  ...(process.env.PUBLIC_APP_ENV === 'development'
    ? serverConfig
    : staticConfig),

  i18n: {
    defaultLocale,
    locales,
  },
});
