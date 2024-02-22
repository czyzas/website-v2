import type { TypedDocumentNode } from '@graphql-typed-document-node/core';
import type { Variables } from 'graphql-request';
import {
  DefaultPageDocument,
  DefaultPagesStaticPathsDocument,
  HomepageDocument,
  ModulesDocument,
} from '@/__generated__/cms';
import type {
  DefaultPageQuery,
  DefaultPageQueryVariables,
  DefaultPagesStaticPathsQuery,
  DefaultPagesStaticPathsQueryVariables,
  HomepageQuery,
  HomepageQueryVariables,
  ModulesQuery,
  ModulesQueryVariables,
} from '@/__generated__/cms';
import { defaultLocale } from '@/i18n/config';
import { gqlClient } from './graphqlClient';

const fetchData = async <Query, QueryVariables extends Variables = Variables>(
  document: TypedDocumentNode<Query, QueryVariables>,
  variables?: QueryVariables,
) => {
  // // In dev mode its good to cache actual data to prevent fetching it from cms over and over again
  // const cache = await getCachedCMSData<Query>(payload);
  // if (cache) {
  //   console.log('🎯 Cache hit for key:', payload.key);
  //   return cache;
  // }

  // Fetch data if cache was not found or its prod mode
  const data = await gqlClient.request<Query>(document, variables);

  // // set cache in dev mode
  // await cacheCMSData(payload, data);

  return data;
};

export const getHomepage = () =>
  fetchData<HomepageQuery, HomepageQueryVariables>(HomepageDocument);

export const getModules = () =>
  fetchData<ModulesQuery, ModulesQueryVariables>(ModulesDocument);

export const getDefaultPagesStaticPaths = async () => {
  try {
    const data = await fetchData<
      DefaultPagesStaticPathsQuery,
      DefaultPagesStaticPathsQueryVariables
    >(DefaultPagesStaticPathsDocument);

    return data.pages?.nodes ?? [];
  } catch (err) {
    console.error(
      'DefaultPagesStaticPaths error',
      err instanceof Error && err.message,
    );
    return [];
  }
};

export const getDefaultPage = async (
  slug: string,
  lang: string = defaultLocale,
) => {
  try {
    const data = await fetchData<DefaultPageQuery, DefaultPageQueryVariables>(
      DefaultPageDocument,
      {
        SLUG: slug,
        LANG: lang,
      },
    );

    return data.pages?.nodes?.at(0) ?? {};
  } catch (err) {
    console.error('DefaultPage error', err instanceof Error && err.message);
    return {};
  }
};
