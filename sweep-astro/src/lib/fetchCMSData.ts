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
  EventsModuleListDocument,
  PostsModuleListDocument,
  SinglePageStaticPathsDocument,
  ComponentIndustriesListDocument,
  IndustryPagesStaticPathsDocument,
  IndustrySingleDocument,
  InsightsPagesStaticPathsDocument,
  InsightsTagsStaticPathsDocument,
  InsightsListPageDocument,
} from '@/__generated__/cms';
import type {
  ComponentIndustriesListFragment,
  EventsModuleListQuery,
  PostsModuleListQuery,
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

// DEFAULT PAGES
export function fetchHomepage(lang: string) {
  return fetchData(HomepageDocument, { LANG: lang }, [
    lang,
    CACHE_KEYS.HOMEPAGE,
  ]);
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
    [CACHE_KEYS.STATIC_PATHS, CACHE_KEYS.PAGE, getUrlWithoutLang(uri)]
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

// INDUSTRIES PAGES
export async function fetchIndustryPagesStaticPaths() {
  // TODO: handle more than 100 pages
  return (
    (
      await fetchData(IndustryPagesStaticPathsDocument, undefined, [
        CACHE_KEYS.STATIC_PATHS,
        CACHE_KEYS.INDUSTRY,
      ])
    ).pages?.nodes ?? []
  );
}

export function fetchIndustrySingle(uri: string, lang: string = defaultLocale) {
  return fetchData(
    IndustrySingleDocument,
    {
      URI: uri,
      LANG: lang,
    },
    [lang, getUrlWithoutLang(uri)]
  );
}

// INSIGHTS
export async function fetchInsightsPagesStaticPaths() {
  // TODO: handle more than 100 pages
  return (
    (
      await fetchData(InsightsPagesStaticPathsDocument, undefined, [
        CACHE_KEYS.STATIC_PATHS,
        CACHE_KEYS.INSIGHTS,
      ])
    ).pages?.nodes ?? []
  );
}
export async function fetchInsightsTagsStaticPaths() {
  // TODO: handle more than 100 pages
  return (
    (
      await fetchData(InsightsTagsStaticPathsDocument, undefined, [
        CACHE_KEYS.STATIC_PATHS,
        CACHE_KEYS.INSIGHTS,
        CACHE_KEYS.TAGS,
      ])
    ).tags?.nodes ?? []
  );
}
export function fetchInsightsListPage(lang: string = defaultLocale) {
  return fetchData(InsightsListPageDocument, { LANG: lang }, [
    lang,
    CACHE_KEYS.INSIGHTS,
  ]);
}

// MODULES
interface PostsParams {
  lang: string;
  categorySlug?: string;
  limit?: number;
}

type PostsReturnType = Promise<
  EventsModuleListQuery | PostsModuleListQuery | never[]
>;

/**
 * Posts module list
 * */
export async function fetchPostsModuleList(
  postType: 'event',
  params: PostsParams
): Promise<EventsModuleListQuery>;
export async function fetchPostsModuleList(
  postType: 'post',
  params: PostsParams
): Promise<PostsModuleListQuery>;
export async function fetchPostsModuleList(
  postType: 'event' | 'post',
  params: PostsParams
): PostsReturnType {
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
    return await fetchData(EventsModuleListDocument, options, [
      CACHE_KEYS.MODULE_LIST_OF_EVENTS,
      hashedOptions,
    ]);
  }

  if (postType === 'post') {
    return await fetchData(PostsModuleListDocument, options, [
      CACHE_KEYS.MODULE_LIST_OF_POSTS,
      hashedOptions,
    ]);
  }

  return [];
}

// COMPONENTS
/**
 * **NOTE** - This function can be used at component-level
 */
export async function fetchComponentIndustriesList(lang: string) {
  const fetched = await fetchData(
    ComponentIndustriesListDocument,
    { LANG: lang },
    [lang, CACHE_KEYS.COMPONENT_INDUSTRIES_LIST]
  );
  return (fetched.industries?.nodes ??
    []) as unknown as ComponentIndustriesListFragment[];
}
