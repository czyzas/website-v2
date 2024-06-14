import { getOptions, getSeo } from './utils-store-helpers';

export function buildCanonicalUrl() {
  const { canonical: seoCanonical = '' } = getSeo();
  const { websiteUrl = '' } = getOptions();

  if (seoCanonical && websiteUrl) {
    const seoCanonicalURL = new URL(seoCanonical, websiteUrl);
    const url = new URL(
      seoCanonicalURL.pathname + seoCanonicalURL.search,
      websiteUrl
    );

    return url.toString();
  }

  return '';
}
