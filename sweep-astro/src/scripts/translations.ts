import { cmsStore } from '@/stores/cmsStore';
import type { ThemeOptionsAcfTranslations } from '@/__generated__/cms';
import type { DeepRequired, OmitRecursively } from '@/types';
import { getStore } from './store';

export type Translations = OmitRecursively<
  DeepRequired<ThemeOptionsAcfTranslations>,
  '__typename' | 'fieldGroupName'
>;

export function getTranslations() {
  const store = getStore(cmsStore);
  if (!store.themeOptions?.themeOptionsAcf?.translations) {
    throw new Error("You can't access translations");
  }

  return store.themeOptions.themeOptionsAcf.translations as Translations;
}
