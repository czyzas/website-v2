module.exports = {
  root: true,
  env: {
    browser: true,
    es2022: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:@typescript-eslint/recommended',
    'plugin:astro/recommended',
    'plugin:astro/jsx-a11y-recommended',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  ignorePatterns: [
    '**/__generated__/*',

    '**/node_modules',
    '**/dist',
    '**/package-lock.json',
    '**/yarn.lock',
    '**/pnpm-lock.yaml',
    '**/bun.lockb',

    '**/dist',
    '**/build',
    '**/output',
    '**/coverage',
    '**/temp',
    '**/.vitepress/cache',
    '**/.nuxt',
    '**/.next',
    '**/.vercel',
    '**/.changeset',
    '**/.idea',
    '**/.cache',
    '**/.output',
    '**/.vite-inspect',

    '**/CHANGELOG*.md',
    '**/*.min.*',
    '**/LICENSE*',
    '**/__snapshots__',
    '**/auto-import?(s).d.ts',
    '**/components.d.ts',
  ],
  globals: {
    NodeJS: true,
    astroHTML: true,
  },
  rules: {
    '@typescript-eslint/triple-slash-reference': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    'no-underscore-dangle': ['error', { allow: ['__typename'] }],
    'import/no-extraneous-dependencies': ['error', { packageDir: '.' }],
    'import/namespace': 'off',
    'no-param-reassign': ['error', { props: false }],
    'no-empty': ['error', { allowEmptyCatch: true }],
    'prefer-const': 'error',
    'no-var': 'error',
    'no-nested-ternary': 'error',
  },
  settings: {
    'import/core-modules': ['astro:assets', 'astro:content'],
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.astro'],
      },
      typescript: {},
    },
  },
  overrides: [
    {
      files: ['*.{js,jsx,ts,tsx}'],
      settings: {
        'import/extensions': ['.js', '.jsx', '.ts', '.tsx'],
        'import/parsers': {
          '@typescript-eslint/parser': ['.ts', '.tsx'],
        },
      },
    },
    {
      files: ['*.{jsx,tsx}'],
      extends: [
        'plugin:react/recommended',
        'plugin:react-hooks/recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:jsx-a11y/recommended',
      ],
      plugins: ['react-refresh', 'jsx-a11y'],
      settings: {
        react: {
          version: 'detect',
        },
      },
      rules: {
        'react/prop-types': 'off',
        'react/react-in-jsx-scope': 'off',
      },
    },
    {
      // Define the configuration for `.astro` file.
      files: ['*.astro'],
      // Allows Astro components to be parsed.
      parser: 'astro-eslint-parser',
      // Parse the script in `.astro` as TypeScript by adding the following configuration.
      // It's the setting you need when using TypeScript.
      parserOptions: {
        parser: '@typescript-eslint/parser',
        extraFileExtensions: ['.astro'],
      },
      rules: {
        'astro/jsx-a11y/media-has-caption': 'off',
        // override/add rules settings here, such as:
        // "astro/no-set-html-directive": "error"
      },
    },
    // ...
  ],
};
