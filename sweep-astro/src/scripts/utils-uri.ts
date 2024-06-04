import { isEmpty, isNil, isNumber, isString, trim } from 'lodash-es';
import { defaultLocale, languages } from '@/i18n/config';

interface CleanURIOptions {
  defaultUri?: string;
}

/**
 * Convert uri to string type, trim slashes, attach proper lang
 */
export function cleanURI(
  dirtyUri: string | number | undefined | null,
  dirtyLang: string | number | undefined | null,
  options: CleanURIOptions = {}
): string | undefined {
  const { defaultUri } = options;
  let uri = dirtyUri;

  // uri is number
  if (isNumber(uri)) {
    uri = String(uri);
  }

  // uri is undefined/null
  // uri is empty string
  // return default uri **WITHOUT** attaching the lang
  if (isNil(uri) || (isString(uri) && isEmpty(uri))) {
    return defaultUri;
  }

  // uri has `/` at the start/end
  if (uri.startsWith('/') || uri.endsWith('/')) {
    uri = trim(uri, '/');
  }

  let lang = dirtyLang;
  if (isNumber(lang) || isNil(lang) || isEmpty(lang)) {
    lang = defaultLocale;
  }

  // uri have lang
  // FIXME: typescript 5.4.5 bug -remove tempUri when its fixed
  const tempUri = uri;
  const currentUriLang = languages.find(
    (locale) => locale !== defaultLocale && tempUri.startsWith(`${locale}/`)
  );

  // uri have lang but its incorrect
  if (currentUriLang && currentUriLang !== lang) {
    // uri have incorrect lang
    uri = uri.replace(`${currentUriLang}/`, `${lang}/`);
  }

  // uri have default lang but its incorrect
  if (!currentUriLang && lang !== defaultLocale) {
    uri = `${lang}/${uri}`;
  }

  return uri;
}

/**
 * Compare uri from astro and uri fetched from CMS
 */
export function compareURI(routingURI?: string, cmsURI?: string) {
  if (!routingURI || !cmsURI) return false;

  return trim(routingURI, '/') === trim(cmsURI, '/');
}

/**
 * Add prefix to the URI
 * @example
 * ```js
 * prefixURI('assets-manager', 'industry'); // 'industry/assets-manager'
 * ```
 */
export function prefixURI(uriWithoutPrefix: string, prefix: string) {
  return [prefix, uriWithoutPrefix].filter(Boolean).join('/');
}

/**
 * Remove prefix from the uri
 * @example
 * ```js
 * unprefixURI('industry/assets-manager', 'industry'); // 'assets-manager'
 * ```
 */
export function unprefixURI(uri: string, prefixToRemove: string) {
  if (!prefixToRemove) return uri;

  const trimmedUri = trim(uri, '/');

  const prefix = `${trim(prefixToRemove, '/')}/`;
  if (!trimmedUri.startsWith(prefix)) return uri;

  return trimmedUri.replace(prefix, '');
}

/**
 * Combine {@link unprefixURI} and {@link prefixURI} functions to replace prefix in URI
 */
export function replacePrefixURI(
  uri: string,
  prefixToSearch: string,
  prefixToReplace: string
) {
  return prefixURI(unprefixURI(uri, prefixToSearch), prefixToReplace);
}
