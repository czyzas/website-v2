import type { GetStaticPathsItem } from 'astro';
import { isFinite } from 'lodash-es';
import { PAGINATION_PREFIX } from '@/constants';

type ParamsWithPaged = GetStaticPathsItem['params'] &
  Record<'paged', string | number | undefined>;

export function paginateURI(baseUri: string, page: number) {
  if (page > 1) return `${baseUri}/${PAGINATION_PREFIX}/${page}`;

  return baseUri;
}

export function unpaginateURI(uri: string) {
  const segmented = uri.split('/');

  if (segmented.at(-2) !== PAGINATION_PREFIX) return uri;

  return segmented.slice(0, -2).join('/');
}

export function fixPagedParams<T extends ParamsWithPaged>(
  params: T
): T & { paged: number } {
  const paged = params?.paged;

  let pagedAsNumber = +(paged ?? 1);
  if (!isFinite(pagedAsNumber)) pagedAsNumber = 1;

  return { ...params, paged: pagedAsNumber };
}
