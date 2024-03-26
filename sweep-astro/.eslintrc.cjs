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
    'unused-imports/no-unused-imports': 'off',
    'no-underscore-dangle': ['error', { allow: ['__typename'] }],
  },
  settings: {
    'import/core-modules': ['astro:assets', 'astro:content'],
  },
  overrides: [
    {
      files: ['*.{js,jsx,ts,tsx}'],
      // parserOptions: {
      //   ecmaVersion: 12,
      //   project: './tsconfig.eslint.json',
      // },
      rules: {},
      settings: {
        'import/extensions': ['.js', '.ts'],
        'import/parsers': {
          '@typescript-eslint/parser': ['.ts'],
        },
        'import/resolver': {
          node: {
            extensions: ['.js', '.ts', '.astro'],
          },
        },
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
