import type { GetStaticPathsItem } from 'astro';
import { castArray, trim } from 'lodash-es';
import { locales, defaultLocale } from './config';

/**
 * Return undefined if provided language is the default one
 * @example
 * ```js
 * const french = getLangParam('fr'); // fr
 * const english = getLangParam('en'); // undefined
 * ```
 */
export const getLangParam = (l: string) =>
  l === defaultLocale ? undefined : l;

export const getUrlWithoutLang = (
  url: string,
  options: {
    /** @default true */
    trimSlashes?: boolean;
  } = {}
) => {
  const { trimSlashes = true } = options;
  let paramPath = url.startsWith('/') ? url.slice(1) : url;
  const chunks = paramPath.split('/');

  if (locales.includes(chunks[0] ?? '')) {
    chunks.shift();
    paramPath = chunks.join('/');
  }

  if (trimSlashes) {
    paramPath = trim(paramPath, '/');
  }

  return paramPath;
};

/**
 * Determine if provided `lang` param is valid, if not, pass it to another param
 *
 * This function fixes the optional default lang problem, when using nested pages , such as `pages/[...lang]/[...page].astro`
 * @param params Static Paths
 * @param notLangParam Name of the other param that is not language
 * @returns
 */
export const fixLangParams = (
  params: GetStaticPathsItem['params'],
  notLangParam: string
) => {
  const lang = params?.lang ? String(params.lang) : null;

  if (!lang) {
    return params;
  }

  if (locales.includes(lang)) {
    return params;
  }

  if (!params?.[notLangParam]) {
    Object.assign(params, { [notLangParam]: '' });
  }

  return {
    ...params,
    lang: undefined,
    [notLangParam]: params[notLangParam]
      ? `${params.lang}/${params[notLangParam]}`
      : params.lang,
  };
};

/**
 * Returns path with attached lang
 * @param pathWithoutLang Path (or array of paths) without language, use array to join multiple segments of uri, don't worry about trailing slashes
 */
export const buildI18nPath = (
  pathWithoutLang: string | string[],
  lang: string
) => {
  const language = locales.includes(lang) ? lang : defaultLocale;
  const path = castArray(pathWithoutLang).map((p) => trim(p, '/'));

  if (pathWithoutLang === '/' && language !== defaultLocale) {
    path.unshift(language);
  }

  return `/${path.filter(Boolean).join('/')}`;
};
