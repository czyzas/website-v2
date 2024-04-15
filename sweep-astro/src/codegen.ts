import type { CodegenConfig } from '@graphql-codegen/cli';
import { env } from './environment';

const config: CodegenConfig = {
  // debug: true,
  // verbose: true,
  config: {
    maybeValue: 'T | undefined',
  },
  schema: env.PUBLIC_CMS_ENDPOINT,
  documents: 'src/lib/queries/**/*.{graphql,gql}',
  generates: {
    'src/__generated__/cms.ts': {
      plugins: ['typescript', 'typescript-operations', 'typed-document-node'],
      config: {
        useTypeImports: true,
      },
    },
  },
  hooks: {
    // onError passes error string to the console.error directly
    onError: console.error,
  },
};

export default config;
