import { defaultLocale, locales } from '@/i18n/config';

/**
 * Returns path with attached lang
 * @param cleanPath Path without lang
 */
export const buildI18nPath = (
  cleanPath = '/',
  lang: string = defaultLocale
) => {
  const language = locales.includes(lang) ? lang : defaultLocale;

  // TODO: handle urls from WP
  if (cleanPath === '/' && language !== defaultLocale) {
    return `/${language}`;
  }

  return cleanPath;
};
