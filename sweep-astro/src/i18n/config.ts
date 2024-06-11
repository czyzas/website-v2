// TODO: rename to defaultLanguage
export const defaultLocale = 'en';
export const languages = ['en', 'fr'] as const;
export const locales: Record<string, string> = {
  en: 'en-US',
  fr: 'fr-FR',
} as const;
