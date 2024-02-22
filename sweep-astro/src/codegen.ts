import type { CodegenConfig } from '@graphql-codegen/cli';
import { env } from './environment';

const config: CodegenConfig = {
  debug: true,
  verbose: true,
  config: {
    maybeValue: 'T | undefined',
  },
  schema: [
    {
      [env.PUBLIC_CMS_ENDPOINT]: {
        headers: {
          Authorization: `Bearer ${env.PUBLIC_CMS_API_TOKEN}`,
        },
      },
    },
  ],
  documents: 'src/lib/queries/**/*.{graphql,gql}',
  generates: {
    'src/__generated__/cms.ts': {
      plugins: ['typescript', 'typescript-operations', 'typed-document-node'],
      config: {
        useTypeImports: true,
      },
    },
  },
};

export default config;
