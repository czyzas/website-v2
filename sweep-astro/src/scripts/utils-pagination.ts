import type { GetStaticPathsItem } from 'astro';
import { isFinite, trimEnd } from 'lodash-es';
import { PAGINATION_PREFIX } from '@/constants';

type ParamsWithPaged = GetStaticPathsItem['params'] &
  Record<'paged', string | number | undefined>;

export function paginateURI(baseUri: string, page: number) {
  const uri = trimEnd(baseUri, '/');

  if (page > 1) return `${uri}/${PAGINATION_PREFIX}/${page}`;

  return uri;
}

export function unpaginateURI(uri: string) {
  const segmented = trimEnd(uri, '/').split('/');

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
