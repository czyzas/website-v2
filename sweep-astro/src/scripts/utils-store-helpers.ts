import { cmsStore } from '@/stores/cmsStore';
import { languageStore } from '@/stores/languageStore';
import { defaultLocale } from '@/i18n/config';
import type { NonNullableProperties, OmitRecursively } from '@/types';
import type {
  EssentialFragment,
  EssentialPageFragment,
} from '@/__generated__/cms';
import { getStore, initializeStore } from './store';
import { cleanArray } from './cleanArray';

type EssentialPageData = { page?: EssentialPageFragment } & EssentialFragment;

export function initializeStores<T extends EssentialPageData>(data: T) {
  const page = data.page!;

  initializeStore(cmsStore, {
    uri: page.uri,
    primaryMenu: data.primaryMenu!,
    themeOptions: data.themeOptionsByLang!,
    subpageSettings: data.page?.subpageSettings,
    seo: page?.seo,
  });

  initializeStore(languageStore, {
    currentLanguage: data.page!.language!,
    languages: data.languages,
    translations: cleanArray(data.page?.translations),
  });
}

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
    allLanguages: cleanArray(store.languages),
    translations: store.translations,
  };
}

export function getSeo() {
  const store = getStore(cmsStore);
  if (store.seo) {
    return store.seo;
  }

  return {};
}
