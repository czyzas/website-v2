import { GraphQLClient } from 'graphql-request';
import { env } from '@/environment';

export const gqlClient = new GraphQLClient(env.PUBLIC_CMS_ENDPOINT);
