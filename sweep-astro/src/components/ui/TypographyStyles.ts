import { cva } from 'class-variance-authority';

export const typographyVariant = cva([], {
  variants: {
    size: {
      h1: 'text-[4.375rem] leading-tight font-bold text-black text-balance',
      h2: 'text-[2.5rem] leading-snug font-bold text-black text-balance',
      h3: 'text-[2rem] leading-tight font-bold text-black text-balance',
      h4: 'text-2xl font-bold text-black text-balance',
      subHead: 'text-base font-semibold text-sw-text-subdued',
      body: 'text-lg text-sw-surface-subdued',
      body2: 'text-base font-semibold text-black',
      bodyLarge: 'text-xl leading-8 text-black',
      cardsBoldLarge: 'text-2xl font-bold text-black',
      cardTitle: 'text-base font-semibold uppercase',
    },
  },
});
