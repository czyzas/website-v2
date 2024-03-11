import type { LanguagesFragment } from '@/__generated__/cms';
import { createStore } from '@/scripts/store';

export const languageStore = createStore<{
  currentLanguage: LanguagesFragment;
  languages?: (LanguagesFragment | undefined)[];
}>({
  currentLanguage: {
    code: 'en',
    language_code: 'en',
  },
  languages: [],
});
