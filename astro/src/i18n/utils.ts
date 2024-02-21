import type {
  GetStaticPaths,
  GetStaticPathsItem,
  GetStaticPathsResult,
} from 'astro';
import { merge } from 'lodash-es';
import { locales, defaultLocale } from './config';

/**
 * Propagate locales to provided params
 */
export const withLangParams = (
  paths: GetStaticPathsResult,
): GetStaticPathsResult => {
  const finalPaths = [];

  for (const lang of locales) {
    for (const pagePath of paths) {
      const raw = {
        params: {
          lang: lang === defaultLocale ? undefined : lang,
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
 * Determine if provided `lang` param is valid, if not, pass it to another param
 *
 * This function fixes the optional default lang problem, when using nested pages , such as `pages/[...lang]/[...page].astro`
 */
export const fixOptionalLanguageParams = (
  params: GetStaticPathsItem['params'],
  notLangParam: string,
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
