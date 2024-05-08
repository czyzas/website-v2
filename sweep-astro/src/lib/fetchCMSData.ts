import crypto from 'node:crypto';
import type { TypedDocumentNode } from '@graphql-typed-document-node/core';
import type { Variables } from 'graphql-request';
import { isNil, omitBy } from 'lodash-es';
import {
  ContactPageDocument,
  DefaultPageDocument,
  DefaultPagesStaticPathsDocument,
  DemoPageDocument,
  HomepageDocument,
  IndustriesListDocument,
  ListOfEventsModuleListDocument,
  ListOfPostsModuleListDocument,
  SinglePageStaticPathsDocument,
} from '@/__generated__/cms';
import type {
  IndustriesListFragment,
  ListOfEventsModuleListQuery,
  ListOfPostsModuleListQuery,
} from '@/__generated__/cms';
import { defaultLocale } from '@/i18n/config';
import { getUrlWithoutLang } from '@/i18n/utils';
import { parseStaticPaths } from '@/scripts/utils-static-paths';
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

/**
 * **NOTE** - This function can be used at component-level
 */
export async function fetchIndustriesList(lang: string) {
  const fetched = await fetchData(IndustriesListDocument, { LANG: lang }, [
    lang,
    CACHE_KEYS.INDUSTRIES_LIST,
  ]);
  return (fetched.industries?.nodes ??
    []) as unknown as IndustriesListFragment[];
}

interface ListOfPostsParams {
  lang: string;
  categorySlug?: string;
  limit?: number;
}

type ListOfPostsReturnType = Promise<
  ListOfEventsModuleListQuery | ListOfPostsModuleListQuery | never[]
>;

export async function fetchListOfPostsModuleList(
  postType: 'event',
  params: ListOfPostsParams
): Promise<ListOfEventsModuleListQuery>;
export async function fetchListOfPostsModuleList(
  postType: 'post',
  params: ListOfPostsParams
): Promise<ListOfPostsModuleListQuery>;
export async function fetchListOfPostsModuleList(
  postType: 'event' | 'post',
  params: ListOfPostsParams
): ListOfPostsReturnType {
  const { lang, categorySlug, limit } = params;

  const options = {
    LANG: lang,
    CATEGORY_SLUG: categorySlug,
    LIMIT: limit && limit > 0 ? limit : undefined,
  };

  const hashedOptions = crypto
    .createHash('md5')
    .update(JSON.stringify(omitBy(options, isNil)))
    .digest('hex');

  if (postType === 'event') {
    return await fetchData(ListOfEventsModuleListDocument, options, [
      CACHE_KEYS.LIST_OF_EVENTS_MODULE_LIST,
      hashedOptions,
    ]);
  }

  if (postType === 'post') {
    return await fetchData(ListOfPostsModuleListDocument, options, [
      CACHE_KEYS.LIST_OF_POSTS_MODULE_LIST,
      hashedOptions,
    ]);
  }

  return [];
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

export async function fetchSinglePageStaticPaths(uri: string) {
  const rawData = await fetchData(
    SinglePageStaticPathsDocument,
    { STATIC_PATH_URI: uri },
    [CACHE_KEYS.STATIC_PATHS, CACHE_KEYS.CONTACT]
  );

  if (!rawData?.page) return [];

  return parseStaticPaths(rawData.page);
}

export function fetchDefaultPage(uri: string, lang: string = defaultLocale) {
  return fetchData(
    DefaultPageDocument,
    {
      URI: uri,
      LANG: lang,
    },
    [lang, CACHE_KEYS.PAGE, getUrlWithoutLang(uri)]
  );
}

export function fetchContactPage(lang: string = defaultLocale) {
  return fetchData(ContactPageDocument, { LANG: lang }, [
    lang,
    CACHE_KEYS.CONTACT,
  ]);
}

export function fetchDemoPage(lang: string = defaultLocale) {
  return fetchData(DemoPageDocument, { LANG: lang }, [lang, CACHE_KEYS.DEMO]);
}
