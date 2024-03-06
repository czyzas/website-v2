export const defaultLocale = 'en';
export const locales = ['en', 'fr', 'de'] as const;
export type Locales = (typeof locales)[number];
