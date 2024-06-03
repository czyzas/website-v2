import { defaultLocale } from '@/i18n/config';
import { createStore } from '@/scripts/store';

export const customersCaseStudiesStore = createStore<{
  isCustomersPage: boolean;
  lang?: string;
  paged?: number;
  tag?: string;
}>({
  isCustomersPage: false,
  lang: defaultLocale,
  paged: 1,
  tag: undefined,
});
