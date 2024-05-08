import type {
  HomepageQuery,
  MenuFragment,
  ThemeOptionsFragment,
} from '@/__generated__/cms';
import { createStore } from '@/scripts/store';

export const cmsStore = createStore<{
  homepage?: HomepageQuery['page'];
  primaryMenu?: MenuFragment;
  themeOptions?: ThemeOptionsFragment;
}>({
  homepage: undefined,
  primaryMenu: undefined,
  themeOptions: undefined,
});
