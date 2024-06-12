import type {
  HomepageQuery,
  SeoFragment,
  SettingsFragment,
  SubpageSettingsFragment,
  ThemeOptionsFragment,
} from '@/__generated__/cms';
import { createStore } from '@/scripts/store';

export type CMSStore = {
  homepage?: HomepageQuery['page'];
  homepageInsights?: HomepageQuery['insights'];
  pageTitle?: string;
  uri?: string;
  settings?: SettingsFragment;
  subpageSettings?: SubpageSettingsFragment;
  themeOptions?: ThemeOptionsFragment;
  seo?: SeoFragment;
};

export const cmsStore = createStore<CMSStore>({
  pageTitle: '',
  uri: '',
  settings: undefined,
  homepage: undefined,
  homepageInsights: undefined,
  subpageSettings: undefined,
  themeOptions: undefined,
  seo: undefined,
});
