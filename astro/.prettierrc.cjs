/** @type {import("prettier").Options} */
module.exports = {
  singleQuote: true,
  plugins: [require.resolve('prettier-plugin-astro')],
  overrides: [
    {
      files: '*.astro',
      options: {
        parser: 'astro',
      },
    },
  ],
};
