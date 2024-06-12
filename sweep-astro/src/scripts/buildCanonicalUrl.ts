import { getOptions, getSeo } from './utils-store-helpers';

export function buildCanonicalUrl() {
  const { canonical: seoCanonical = '' } = getSeo();
  const { websiteUrl = '' } = getOptions();

  if (seoCanonical && websiteUrl) {
    const seoCanonicalURL = new URL(seoCanonical);
    const prodURL = new URL(websiteUrl);
    prodURL.pathname = seoCanonicalURL.pathname;

    return prodURL.toString();
  }

  return '';
}
