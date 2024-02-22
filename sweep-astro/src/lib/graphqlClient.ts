import { GraphQLClient } from 'graphql-request';
import { env } from '@/environment';

export const gqlClient = new GraphQLClient(env.PUBLIC_CMS_ENDPOINT, {
  headers: {
    Authorization: `Bearer ${env.PUBLIC_CMS_API_TOKEN}`,
  },
});
