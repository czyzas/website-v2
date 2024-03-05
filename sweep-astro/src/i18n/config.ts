export const defaultLocale = 'en';
export const locales = ['en', 'fr', 'pl'] as const;
export type Locales = (typeof locales)[number];
