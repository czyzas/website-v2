import type {
  HomepageQuery,
  LanguagesFragment,
  MenuFragment,
  ThemeOptionsFragment,
} from '@/__generated__/cms';
import { createStore } from '@/scripts/store';

export const cmsStore = createStore<{
  languages?: (LanguagesFragment | undefined)[];
  homepage?: HomepageQuery['page'];
  homepageIndustries?: HomepageQuery['industries'];
  primaryMenu?: MenuFragment;
  themeOptions?: ThemeOptionsFragment;
}>({
  languages: [],
  homepage: undefined,
  homepageIndustries: undefined,
  primaryMenu: undefined,
  themeOptions: undefined,
});
