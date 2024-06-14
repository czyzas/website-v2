// eslint-disable-next-line import/no-extraneous-dependencies
import { loadEnv } from 'vite';
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel/serverless';
// import node from '@astrojs/node';
import tailwind from '@astrojs/tailwind';
import icon from 'astro-icon';
import react from '@astrojs/react';
import svgr from 'vite-plugin-svgr';
import { defaultLocale, languages } from './src/i18n/config';

const appMode = (process.env.APP_MODE ?? 'static') as 'static' | 'ssr';
const { CMS_ASSETS_DOMAIN } = loadEnv(
  process.env.NODE_ENV ?? 'production',
  process.cwd(),
  ''
);

// https://astro.build/config
export default defineConfig({
  output: appMode === 'ssr' ? 'server' : 'static',
  adapter: appMode === 'ssr' ? vercel() : undefined,
  i18n: {
    defaultLocale,
    locales: [...languages],
  },
  image: {
    domains: [CMS_ASSETS_DOMAIN],
  },
  integrations: [
    icon({
      iconDir: 'src/assets/icons',
    }),
    tailwind({
      nesting: true,
    }),
    react(),
  ],
  vite: {
    plugins: [svgr()],
  },
});
