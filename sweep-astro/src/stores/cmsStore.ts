import type {
  ContactPageQuery,
  DemoPageQuery,
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
  defaultPage?: Page;
  contactPage?: ContactPageQuery;
  demoPage?: DemoPageQuery;
  primaryMenu?: MenuFragment;
  themeOptions?: ThemeOptionsFragment;
}>({
  languages: [],
  homepage: undefined,
  defaultPage: undefined,
  contactPage: undefined,
  demoPage: undefined,
  primaryMenu: undefined,
  themeOptions: undefined,
});
