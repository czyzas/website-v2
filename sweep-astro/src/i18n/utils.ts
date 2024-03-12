import type {
  GetStaticPaths,
  GetStaticPathsItem,
  GetStaticPathsResult,
} from 'astro';
import { merge, trim } from 'lodash-es';
import { locales, defaultLocale } from './config';

export const getLangParam = (l: string) =>
  l === defaultLocale ? undefined : l;

export const getUrlWithoutLang = (
  url: string,
  options?: { trimSlashes?: boolean }
) => {
  const { trimSlashes = true } = options ?? {};
  const startsWithSlash = url.startsWith('/');
  let paramPath = startsWithSlash ? url.slice(1) : url;
  const chunks = paramPath.split('/');

  if (locales.includes(chunks.at(0) ?? '')) {
    chunks.shift();
    paramPath = chunks.join('/');
  }

  if (trimSlashes) {
    paramPath = trim(paramPath, '/');
  }

  return paramPath;
};

/**
 * Propagate locales to provided params
 */
export const withLangParams = (
  paths: GetStaticPathsResult
): GetStaticPathsResult => {
  const finalPaths = [];

  for (const lang of locales) {
    for (const pagePath of paths) {
      const raw = {
        params: {
          lang: getLangParam(lang),
        },
      };
      finalPaths.push(merge(raw, pagePath));
    }
  }

  return finalPaths;
};

/**
 * Propagate locales to single page without params
 */
export const getStaticPathsWithLangs = (() =>
  withLangParams([{ params: {} }])) satisfies GetStaticPaths;

/**
 *  * Determine if provided `lang` param is valid, if not, pass it to another param
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
