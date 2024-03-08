import type { HomepageQuery, LanguagesFragment } from '@/__generated__/cms';
import { createStore } from '@/scripts/store';

export const cmsStore = createStore<{
  languages?: (LanguagesFragment | undefined)[];
  homepage?: HomepageQuery['page'];
  homepageIndustries: HomepageQuery['industries'];
}>({
  languages: [],
  homepage: undefined,
  homepageIndustries: undefined,
});
