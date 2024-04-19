import type { TypedDocumentNode } from '@graphql-typed-document-node/core';
import type { Variables } from 'graphql-request';
import {
  ContactPageDocument,
  DefaultPageDocument,
  DefaultPagesStaticPathsDocument,
  HomepageDocument,
  IndustriesListDocument,
} from '@/__generated__/cms';
import type { IndustriesListFragment } from '@/__generated__/cms';

import { defaultLocale } from '@/i18n/config';
import { gqlClient } from './graphqlClient';
import { getCachedCMSData, cacheCMSData, CACHE_KEYS } from './cacheCMSData';

const fetchData = async <Query, QueryVariables extends Variables = Variables>(
  document: TypedDocumentNode<Query, QueryVariables>,
  variables?: QueryVariables,
  cacheKey?: string[]
) => {
  if (import.meta.env.DEV && cacheKey) {
    // In dev mode its good to cache actual data to prevent fetching it from cms over and over again
    const cache = await getCachedCMSData<Query>(cacheKey);
    if (cache) {
      console.info(
        new Date().toLocaleTimeString(),
        `\x1B[33m[cache]\x1B[0m`,
        `Cache hit (${cacheKey.join('/')})`
      );
      return cache;
    }

    console.info(
      new Date().toLocaleTimeString(),
      `\x1B[35m[cache]\x1B[0m`,
      `Cache missed, fetching... (${cacheKey.join('/')})`
    );
  }

  // Fetch data if cache was not found or its prod mode
  const data = await gqlClient.request<Query>(document, variables);

  // set cache in dev mode
  if (import.meta.env.DEV && cacheKey) {
    await cacheCMSData(cacheKey, data);
  }

  return data;
};

export function fetchHomepage(lang: string) {
  return fetchData(HomepageDocument, { LANG: lang }, [
    lang,
    CACHE_KEYS.HOMEPAGE,
  ]);
}

export async function fetchIndustriesList(lang: string) {
  const fetched = await fetchData(IndustriesListDocument, { LANG: lang }, [
    lang,
    CACHE_KEYS.INDUSTRIES_LIST,
  ]);
  return (fetched.industries?.nodes ??
    []) as unknown as IndustriesListFragment[];
}

export async function fetchDefaultPagesStaticPaths() {
  // TODO: handle more than 100 pages
  return (
    (
      await fetchData(DefaultPagesStaticPathsDocument, undefined, [
        'static-paths',
        CACHE_KEYS.PAGE,
      ])
    ).pages?.nodes ?? []
  );
}

export function fetchDefaultPage(slug: string, lang: string = defaultLocale) {
  return fetchData(
    DefaultPageDocument,
    {
      SLUG: slug,
      LANG: lang,
    },
    [lang, CACHE_KEYS.PAGE, slug]
  );
}

export function fetchContactPage(lang: string = defaultLocale) {
  return fetchData(ContactPageDocument, { LANG: lang }, [
    lang,
    CACHE_KEYS.CONTACT,
  ]);
}
