import type { IndustriesListFragment } from '@/__generated__/cms';
import { createStore } from '@/scripts/store';

export const cacheStore = createStore<{
  allIndustries?: IndustriesListFragment[];
}>({
  allIndustries: undefined,
});
