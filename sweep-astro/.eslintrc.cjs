module.exports = {
  root: true,
  env: {
    browser: true,
    es2022: true,
  },
  extends: [
    '@tysian/typescript',
    'plugin:@typescript-eslint/recommended',
    'plugin:astro/recommended',
    'plugin:astro/jsx-a11y-recommended',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  ignorePatterns: ['**/__generated__/*'],
  globals: {
    astroHTML: true,
  },
  rules: {
    '@typescript-eslint/triple-slash-reference': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    'no-underscore-dangle': ['error', { allow: ['__typename'] }],
    'import/no-extraneous-dependencies': ['error', { packageDir: '.' }],
    'no-param-reassign': ['error', { props: false }],
  },
  settings: {
    'import/core-modules': ['astro:assets', 'astro:content'],
  },
  overrides: [
    {
      files: ['*.{js,jsx,ts,tsx}'],
      extends: [],
      settings: {
        'import/extensions': ['.js', '.jsx', '.ts', '.tsx'],
        'import/parsers': {
          '@typescript-eslint/parser': ['.ts', '.tsx'],
        },
        'import/resolver': {
          node: {
            extensions: ['.js', '.ts', '.astro'],
          },
        },
      },
    },
    {
      files: ['*.{jsx,tsx}'],
      extends: [
        'plugin:react/recommended',
        'plugin:react/jsx-runtime',
        'plugin:jsx-a11y/recommended',
      ],
      settings: {
        react: {
          version: 'detect',
        },
      },
      rules: {
        'react/prop-types': 'off',
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
