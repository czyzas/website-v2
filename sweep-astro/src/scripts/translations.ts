import { cmsStore } from '@/stores/cmsStore';
import type { ThemeOptionsAcfTranslations } from '@/__generated__/cms';
import type { NonNullableProperties, OmitRecursively, Prettify } from '@/types';
import { getStore } from './store';

export type Translations = ThemeOptionsAcfTranslations;

export function getTranslations() {
  const store = getStore(cmsStore);
  if (!store.themeOptions?.themeOptionsAcf?.translations) {
    throw new Error("You can't access translations");
  }

  const t = store.themeOptions.themeOptionsAcf.translations as Prettify<
    OmitRecursively<
      NonNullableProperties<typeof store.themeOptions.themeOptionsAcf>,
      '__typename'
    >
  >;

  return { t };
}
