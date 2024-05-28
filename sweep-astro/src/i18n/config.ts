// TODO: rename to defaultLanguage
export const defaultLocale = 'en';
export const languages = ['en', 'fr', 'de'] as const;
export const locales: Record<string, string> = {
  en: 'en-UK',
  fr: 'fr-FR',
  de: 'de-DE',
} as const;
