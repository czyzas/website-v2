import type {
  HomepageQuery,
  MenuFragment,
  SubpageSettingsFragment,
  ThemeOptionsFragment,
} from '@/__generated__/cms';
import { createStore } from '@/scripts/store';

export const cmsStore = createStore<{
  homepage?: HomepageQuery['page'];
  homepageInsights?: HomepageQuery['insights'];
  primaryMenu?: MenuFragment;
  subpageSettings?: SubpageSettingsFragment;
  themeOptions?: ThemeOptionsFragment;
}>({
  homepage: undefined,
  homepageInsights: undefined,
  primaryMenu: undefined,
  subpageSettings: undefined,
  themeOptions: undefined,
});
