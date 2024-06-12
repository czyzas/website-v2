import { cmsStore } from '@/stores/cmsStore';
import type { CMSStore } from '@/stores/cmsStore';
import { languageStore } from '@/stores/languageStore';
import type { LanguageStore } from '@/stores/languageStore';
import { defaultLocale } from '@/i18n/config';
import type { NonNullableProperties, ReplaceTypenameLiteral2 } from '@/types';
import type {
  EssentialFragment,
  EssentialPageFragment,
} from '@/__generated__/cms';
import { getStore, initializeStore } from './store';
import { cleanArray } from './cleanArray';

type EssentialPageData = {
  page?: ReplaceTypenameLiteral2<EssentialPageFragment>;
} & EssentialFragment;

export function initializeStores(
  data: EssentialPageData,
  payload?: { cmsPayload?: CMSStore; languagePayload?: LanguageStore }
) {
  const { cmsPayload, languagePayload } = payload ?? {};

  const page = data.page! as EssentialPageFragment;

  initializeStore(cmsStore, {
    pageTitle: page.title,
    uri: page.uri,
    themeOptions: data.themeOptionsByLang!,
    subpageSettings: page?.subpageSettings,
    seo: page?.seo,
    settings: data.allSettings,
    ...(cmsPayload ?? {}),
  });

  initializeStore(languageStore, {
    currentLanguage: page.language!,
    languages: data.languages,
    translations: cleanArray(data.page?.translations),
    ...(languagePayload ?? {}),
  });
}

export function getOptions() {
  const store = getStore(cmsStore);
  if (!store.themeOptions?.themeOptionsAcf) {
    throw new Error("You can't access theme options");
  }

  return store.themeOptions.themeOptionsAcf as NonNullableProperties<
    typeof store.themeOptions.themeOptionsAcf
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
