import type { TypedDocumentNode } from '@graphql-typed-document-node/core';
import type { Variables } from 'graphql-request';
import {
  EstateDocument,
  EstatesDocument,
  HomepageDocument,
} from '@/__generated__/cms';
import type {
  EstateQuery,
  EstateQueryVariables,
  EstatesQuery,
  EstatesQueryVariables,
  HomepageQuery,
  HomepageQueryVariables,
} from '@/__generated__/cms';
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

export const getHomepage = (lang: string) =>
  fetchData<HomepageQuery, HomepageQueryVariables>(HomepageDocument, {
    LOCALE: lang,
  });

export const getEstates = (lang: string) =>
  fetchData<EstatesQuery, EstatesQueryVariables>(EstatesDocument, {
    LOCALE: lang,
  });

export const getEstatePage = (id: string, lang: string) =>
  fetchData<EstateQuery, EstateQueryVariables>(EstateDocument, {
    ESTATE_ID: id,
    LOCALE: lang,
  });

// export const getTextPages = () =>
//   fetchData<TextPagesQuery, TextPagesQueryVariables>(
//     { key: CACHE_KEYS.TEXT_PAGE },
//     TextPagesDocument,
//   );

// export const getTextPage = (id: string) =>
//   fetchData<TextPageQuery, TextPageQueryVariables>(
//     { key: CACHE_KEYS.TEXT_PAGE, id },
//     TextPageDocument,
//     { TEXT_PAGE_ID: id },
//   );
