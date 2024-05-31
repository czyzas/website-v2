import type { ComponentIndustriesListFragment } from '@/__generated__/cms';
import { createStore } from '@/scripts/store';

export const cacheStore = createStore<{
  allIndustries?: ComponentIndustriesListFragment[];
}>({
  allIndustries: [],
});
