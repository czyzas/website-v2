import type { HTMLAttributes } from 'astro/types';

export type DynamicTagAttributes<
  T extends keyof astroHTML.JSX.DefinedIntrinsicElements,
> = Partial<astroHTML.JSX.IntrinsicAttributes & HTMLAttributes<T>>;

export type WithAttributes<T> = astroHTML.JSX.IntrinsicAttributes & T;
