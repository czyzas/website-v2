import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel/serverless';
import tailwind from '@astrojs/tailwind';
import icon from 'astro-icon';
import { defaultLocale, locales } from './src/i18n/config';

const appMode = process.env.APP_MODE ?? 'static';

// https://astro.build/config
export default defineConfig({
  output: appMode === 'ssr' ? 'server' : 'static',
  adapter: appMode === 'ssr' ? vercel() : undefined,
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
