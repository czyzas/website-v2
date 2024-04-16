import type { LanguagesFragment } from '@/__generated__/cms';
import { defaultLocale } from '@/i18n/config';
import { createStore } from '@/scripts/store';

export const languageStore = createStore<{
  currentLanguage: LanguagesFragment;
  languages?: (LanguagesFragment | undefined)[];
}>({
  currentLanguage: {
    code: defaultLocale,
    language_code: defaultLocale,
  },
  languages: [],
});
