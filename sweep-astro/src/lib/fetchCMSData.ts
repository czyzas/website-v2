import type { TypedDocumentNode } from '@graphql-typed-document-node/core';
import type { Variables } from 'graphql-request';
import {
  ContactPageDocument,
  ContactPageStaticPathsDocument,
  DefaultPageDocument,
  DefaultPagesStaticPathsDocument,
  HomepageDocument,
  HomepageStaticPathsDocument,
  IndustriesListDocument,
} from '@/__generated__/cms';
import type { IndustriesListFragment } from '@/__generated__/cms';

import { defaultLocale } from '@/i18n/config';
import { getUrlWithoutLang } from '@/i18n/utils';
import { gqlClient } from './graphqlClient';
import { getCachedCMSData, cacheCMSData, CACHE_KEYS } from './cacheCMSData';
import { parseStaticPaths } from './helpers';

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

export async function fetchHomepageStaticPaths() {
  const rawData = await fetchData(HomepageStaticPathsDocument, undefined, [
    CACHE_KEYS.STATIC_PATHS,
    CACHE_KEYS.HOMEPAGE,
  ]);

  if (!rawData?.page) return [];

  return parseStaticPaths(rawData.page);
}
export async function fetchDefaultPagesStaticPaths() {
  // TODO: handle more than 100 pages
  return (
    (
      await fetchData(DefaultPagesStaticPathsDocument, undefined, [
        CACHE_KEYS.STATIC_PATHS,
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
    [lang, CACHE_KEYS.PAGE, getUrlWithoutLang(slug)]
  );
}

export async function fetchContactStaticPaths() {
  const rawData = await fetchData(ContactPageStaticPathsDocument, undefined, [
    CACHE_KEYS.STATIC_PATHS,
    CACHE_KEYS.CONTACT,
  ]);

  if (!rawData?.page) return [];

  return parseStaticPaths(rawData.page);
}
export function fetchContactPage(lang: string = defaultLocale) {
  return fetchData(ContactPageDocument, { LANG: lang }, [
    lang,
    CACHE_KEYS.CONTACT,
  ]);
}
