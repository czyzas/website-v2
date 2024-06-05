/** @type {import("prettier").Options} */
const config = {
  singleQuote: true,
  trailingComma: 'es5',
  plugins: ['prettier-plugin-astro', 'prettier-plugin-tailwindcss'],
  tailwindFunctions: ['cn', 'cva'],
  overrides: [
    {
      files: '*.astro',
      options: {
        parser: 'astro',
      },
    },
  ],
};

export default config;
