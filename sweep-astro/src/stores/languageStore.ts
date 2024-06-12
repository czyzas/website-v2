import type { LanguagesFragment } from '@/__generated__/cms';
import { defaultLocale } from '@/i18n/config';
import { createStore } from '@/scripts/store';
import type { PageTranslations } from '@/types';

export type LanguageStore = {
  currentLanguage: LanguagesFragment;
  languages?: (LanguagesFragment | undefined)[];
  translations: PageTranslations;
};

export const languageStore = createStore<LanguageStore>({
  currentLanguage: {
    code: defaultLocale,
    language_code: defaultLocale,
  },
  languages: [],
  translations: [],
});
