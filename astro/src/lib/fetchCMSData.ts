import type { TypedDocumentNode } from '@graphql-typed-document-node/core';
import type { Variables } from 'graphql-request';
import {
  HomepageDocument,
} from '@/__generated__/cms';
import type {
  HomepageQuery,
  HomepageQueryVariables
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

export const getHomepage = () =>
    fetchData<HomepageQuery, HomepageQueryVariables>(HomepageDocument);

