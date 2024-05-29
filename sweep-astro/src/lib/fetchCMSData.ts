import crypto from 'node:crypto';
import type { TypedDocumentNode } from '@graphql-typed-document-node/core';
import type { Variables } from 'graphql-request';
import { cloneDeep, isNil, omit, omitBy } from 'lodash-es';
import {
  ContactPageDocument,
  DefaultPageDocument,
  DefaultPagesStaticPathsDocument,
  DemoPageDocument,
  HomepageDocument,
  EventsModuleListDocument,
  NewsroomModuleListDocument,
  SinglePageStaticPathsDocument,
  ComponentIndustriesListDocument,
  IndustryPagesStaticPathsDocument,
  IndustrySingleDocument,
  InsightsPagesStaticPathsDocument,
  InsightsTagsStaticPathsDocument,
  InsightsListPageDocument,
  InsightsSinglePageDocument,
  NewsroomListPageDocument,
  NewsroomTagsStaticPathsDocument,
  NewsroomSinglePageDocument,
  NewsroomPagesStaticPathsDocument,
  EventPagesStaticPathsDocument,
  EventSinglePageDocument,
  EventsListPageDocument,
  EventTagsStaticPathsDocument,
  EventsTotalPagesDocument,
  InsightsTotalPagesDocument,
  NewsroomTotalPagesDocument,
} from '@/__generated__/cms';
import type {
  ComponentIndustriesListFragment,
  EventsModuleListQuery,
  NewsroomModuleListQuery,
} from '@/__generated__/cms';
import { defaultLocale } from '@/i18n/config';
import { getUrlWithoutLang } from '@/i18n/utils';
import { DEFAULT_POSTS_PER_PAGE } from '@/constants';
import { gqlClient } from './graphqlClient';
import {
  getCachedCMSData,
  cacheCMSData,
  CACHE_KEYS,
  paginateCacheKey,
} from './cacheCMSData';

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

export type TotalPagesAllowedPostTypes = 'insights' | 'newsroom' | 'event';
export async function fetchTotalPages(
  postType: TotalPagesAllowedPostTypes,
  payload: {
    lang?: string;
    postsPerPage: number;
    tagSlug?: string;
  }
) {
  const { lang = defaultLocale, postsPerPage, tagSlug = '' } = payload ?? {};
  const options = {
    LANG: lang,
    POSTS_PER_PAGE: postsPerPage,
    TAG_SLUG: tagSlug,
  };
  const cache = [CACHE_KEYS.TOTAL_PAGES, postType];
  let data;
  switch (postType) {
    case 'insights':
      data = await fetchData(InsightsTotalPagesDocument, options, cache);
      break;
    case 'newsroom':
      data = await fetchData(NewsroomTotalPagesDocument, options, cache);
      break;
    case 'event':
      data = await fetchData(EventsTotalPagesDocument, options, cache);
      break;
    default:
      return 1;
  }

  return data.pages?.pageInfo.pagination?.totalPages || 1;
}

// DEFAULT PAGES
export function fetchHomepage(lang: string) {
  return fetchData(HomepageDocument, { LANG: lang }, [
    lang,
    CACHE_KEYS.HOMEPAGE,
  ]);
}

export async function fetchDefaultPagesStaticPaths() {
  return (
    (
      await fetchData(DefaultPagesStaticPathsDocument, undefined, [
        CACHE_KEYS.STATIC_PATHS,
        CACHE_KEYS.PAGE,
      ])
    ).pages?.nodes ?? []
  );
}

/**
 * Take raw page (page object + translations[]) from WP and return array of all pages
 * @example
 *
 * ```
 * const raw = {
 *   // original page
 *   translations: [
 *     // other translated pages
 *   ],
 * };
 *
 * const parsed = [
 *   // all pages inside array
 * ];
 * ```
 */
export async function fetchSinglePageStaticPaths(uri: string) {
  const rawData = await fetchData(
    SinglePageStaticPathsDocument,
    { STATIC_PATH_URI: uri },
    [CACHE_KEYS.STATIC_PATHS, CACHE_KEYS.PAGE, getUrlWithoutLang(uri)]
  );

  if (!rawData?.page) return [];

  const translations = rawData.page?.translations ?? [];
  const originalPage = cloneDeep(omit(rawData.page, 'translations'));

  return [originalPage, ...translations].filter(Boolean);
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
  return (
    (
      await fetchData(InsightsTagsStaticPathsDocument, undefined, [
        CACHE_KEYS.STATIC_PATHS,
        CACHE_KEYS.INSIGHTS,
        CACHE_KEYS.TAG,
      ])
    ).tags?.nodes ?? []
  );
}
export function fetchInsightsListPage(
  lang: string = defaultLocale,
  payload?: { tag?: string; paged?: number; postsPerPage?: number }
) {
  const {
    tag = '',
    paged = 1,
    postsPerPage = DEFAULT_POSTS_PER_PAGE,
  } = payload ?? {};

  return fetchData(
    InsightsListPageDocument,
    {
      LANG: lang,
      TAG_SLUG: tag,
      PAGED: +paged,
      POSTS_PER_PAGE: postsPerPage,
    },
    paginateCacheKey(
      tag
        ? [lang, CACHE_KEYS.INSIGHTS, CACHE_KEYS.TAG, tag]
        : [lang, CACHE_KEYS.INSIGHTS],
      paged
    )
  );
}
export function fetchInsightsSingle(uri: string, lang: string = defaultLocale) {
  return fetchData(
    InsightsSinglePageDocument,
    {
      URI: uri,
      LANG: lang,
    },
    [lang, getUrlWithoutLang(uri)]
  );
}

// NEWSROOM
export async function fetchNewsroomPagesStaticPaths() {
  return (
    (
      await fetchData(NewsroomPagesStaticPathsDocument, undefined, [
        CACHE_KEYS.STATIC_PATHS,
        CACHE_KEYS.NEWSROOM,
      ])
    ).pages?.nodes ?? []
  );
}
export async function fetchNewsroomTagsStaticPaths() {
  return (
    (
      await fetchData(NewsroomTagsStaticPathsDocument, undefined, [
        CACHE_KEYS.STATIC_PATHS,
        CACHE_KEYS.NEWSROOM,
        CACHE_KEYS.TAG,
      ])
    ).tags?.nodes ?? []
  );
}
export function fetchNewsroomListPage(
  lang: string = defaultLocale,
  tag?: string
) {
  return fetchData(
    NewsroomListPageDocument,
    {
      LANG: lang,
      TAG_SLUG: tag,
    },
    tag
      ? [lang, CACHE_KEYS.NEWSROOM, CACHE_KEYS.TAG, tag]
      : [lang, CACHE_KEYS.NEWSROOM]
  );
}
export function fetchNewsroomSingle(uri: string, lang: string = defaultLocale) {
  return fetchData(
    NewsroomSinglePageDocument,
    {
      URI: uri,
      LANG: lang,
    },
    [lang, getUrlWithoutLang(uri)]
  );
}

// EVENT
export async function fetchEventPagesStaticPaths() {
  return (
    (
      await fetchData(EventPagesStaticPathsDocument, undefined, [
        CACHE_KEYS.STATIC_PATHS,
        CACHE_KEYS.EVENTS,
      ])
    ).pages?.nodes ?? []
  );
}
export async function fetchEventTagsStaticPaths() {
  return (
    (
      await fetchData(EventTagsStaticPathsDocument, undefined, [
        CACHE_KEYS.STATIC_PATHS,
        CACHE_KEYS.EVENTS,
        CACHE_KEYS.TAG,
      ])
    ).tags?.nodes ?? []
  );
}
export function fetchEventsListPage(
  lang: string = defaultLocale,
  tag?: string
) {
  return fetchData(
    EventsListPageDocument,
    {
      LANG: lang,
      TAG_SLUG: tag,
    },
    tag
      ? [lang, CACHE_KEYS.EVENTS, CACHE_KEYS.TAG, tag]
      : [lang, CACHE_KEYS.EVENTS]
  );
}
export function fetchEventSingle(uri: string, lang: string = defaultLocale) {
  return fetchData(
    EventSinglePageDocument,
    {
      URI: uri,
      LANG: lang,
    },
    [lang, getUrlWithoutLang(uri)]
  );
}

// MODULES
interface PostsParams {
  lang: string;
  categorySlug?: string;
  limit?: number;
}

type PostsReturnType = Promise<
  EventsModuleListQuery | NewsroomModuleListQuery | never[]
>;

/**
 * Posts module list
 * */
export async function fetchPostsModuleList(
  postType: 'event',
  params: PostsParams
): Promise<EventsModuleListQuery>;
export async function fetchPostsModuleList(
  postType: 'newsroom',
  params: PostsParams
): Promise<NewsroomModuleListQuery>;
export async function fetchPostsModuleList(
  postType: 'event' | 'newsroom',
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

  if (postType === 'newsroom') {
    return await fetchData(NewsroomModuleListDocument, options, [
      CACHE_KEYS.MODULE_LIST_OF_NEWSROOM,
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
