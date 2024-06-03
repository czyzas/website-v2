import type { CustomersPageQuery } from '@/__generated__/cms';
import { defaultLocale } from '@/i18n/config';
import { createStore } from '@/scripts/store';

export const customersCaseStudiesStore = createStore<{
  isCustomersPage: boolean;
  lang?: string;
  paged?: number;
  tag?: string;
  data?: CustomersPageQuery;
}>({
  isCustomersPage: false,
  lang: defaultLocale,
  paged: 1,
  tag: undefined,
  data: undefined,
});
