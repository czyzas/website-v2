import { cmsStore } from '@/stores/cmsStore';
import { languageStore } from '@/stores/languageStore';
import { defaultLocale } from '@/i18n/config';
import type { NonNullableProperties, OmitRecursively } from '@/types';
import { getStore } from './store';

export function getOptions() {
  const store = getStore(cmsStore);
  if (!store.themeOptions?.themeOptionsAcf) {
    throw new Error("You can't access theme options");
  }

  return store.themeOptions.themeOptionsAcf as OmitRecursively<
    NonNullableProperties<typeof store.themeOptions.themeOptionsAcf>,
    '__typename'
  >;
}

export function getLanguage() {
  const store = getStore(languageStore);
  if (!store.currentLanguage || !store.languages) {
    throw new Error("You can't access languages");
  }

  return {
    currentLanguage: store.currentLanguage.code,
    defaultLanguage: defaultLocale,
    allLanguages: (store.languages ?? []).filter(Boolean),
  };
}
