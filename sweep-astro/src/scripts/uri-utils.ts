import { isEmpty, isNil, isNumber, isString, trim } from 'lodash-es';
import { defaultLocale, locales } from '@/i18n/config';

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
  // FIXME: typescript 5.4.5 bug - wait until its fixed
  const tempUri = uri;
  const currentUriLang = locales.find(
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
