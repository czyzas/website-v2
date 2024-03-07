import type { TypedDocumentNode } from '@graphql-typed-document-node/core';
import type { Variables } from 'graphql-request';
import {
  DefaultPageDocument,
  DefaultPagesStaticPathsDocument,
  HomepageDocument,
} from '@/__generated__/cms';

import type { Locales } from '@/i18n/config';
import { defaultLocale } from '@/i18n/config';
import { gqlClient } from './graphqlClient';
import { getCachedCMSData, cacheCMSData, CACHE_KEYS } from './cacheCMSData';

const fetchData = async <Query, QueryVariables extends Variables = Variables>(
  document: TypedDocumentNode<Query, QueryVariables>,
  variables?: QueryVariables,
  cacheKey?: string[],
) => {
  if (cacheKey) {
    // In dev mode its good to cache actual data to prevent fetching it from cms over and over again
    const cache = await getCachedCMSData<Query>(cacheKey);
    if (cache) {
      console.log(
        new Date().toLocaleTimeString(),
        `\x1B[33m[cache]\x1B[0m`,
        `Cache hit (${cacheKey.join('/')})`,
      );
      return cache;
    }

    console.log(
      new Date().toLocaleTimeString(),
      `\x1B[35m[cache]\x1B[0m`,
      `Cache missed, fetching... (${cacheKey.join('/')})`,
    );
  }

  // Fetch data if cache was not found or its prod mode
  const data = await gqlClient.request<Query>(document, variables);

  // set cache in dev mode
  if (cacheKey) {
    await cacheCMSData(cacheKey, data);
  }

  return data;
};

export function fetchHomepage(lang: Locales) {
  const HOMEPAGE_IDS: Record<Locales, string> = {
    en: '6',
    fr: '506',
    de: '163',
  };
  return fetchData(
    HomepageDocument,
    {
      PAGE_ID: HOMEPAGE_IDS[lang],
    },
    [lang, CACHE_KEYS.HOMEPAGE],
  );
}

export function fetchDefaultPagesStaticPaths() {
  return fetchData(DefaultPagesStaticPathsDocument).then(
    (data) => data.pages?.nodes ?? [],
  );
}

export function fetchDefaultPage(slug: string, lang: Locales = defaultLocale) {
  return fetchData(
    DefaultPageDocument,
    {
      SLUG: slug,
      LANG: lang,
    },
    [lang, CACHE_KEYS.PAGE, slug],
  ).then((data) => data.pages?.nodes?.[0]);
}
