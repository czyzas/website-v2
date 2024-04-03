import type {
  HomepageQuery,
  LanguagesFragment,
  MenuFragment,
  Page,
  ThemeOptionsFragment,
} from '@/__generated__/cms';
import { createStore } from '@/scripts/store';

export const cmsStore = createStore<{
  languages?: (LanguagesFragment | undefined)[];
  homepage?: HomepageQuery['page'];
  homepageIndustries?: HomepageQuery['industries'];
  defaultPage?: Page;
  primaryMenu?: MenuFragment;
  themeOptions?: ThemeOptionsFragment;
}>({
  languages: [],
  homepage: undefined,
  homepageIndustries: undefined,
  defaultPage: undefined,
  primaryMenu: undefined,
  themeOptions: undefined,
});
