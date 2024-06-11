import type {
  HomepageQuery,
  MenuFragment,
  SeoFragment,
  SubpageSettingsFragment,
  ThemeOptionsFragment,
} from '@/__generated__/cms';
import { createStore } from '@/scripts/store';

export const cmsStore = createStore<{
  homepage?: HomepageQuery['page'];
  homepageInsights?: HomepageQuery['insights'];
  uri?: string;
  primaryMenu?: MenuFragment;
  subpageSettings?: SubpageSettingsFragment;
  themeOptions?: ThemeOptionsFragment;
  seo?: SeoFragment;
}>({
  uri: '',
  homepage: undefined,
  homepageInsights: undefined,
  primaryMenu: undefined,
  subpageSettings: undefined,
  themeOptions: undefined,
  seo: undefined,
});
