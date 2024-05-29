import { cloneDeep, isFunction } from 'lodash-es';
import { getLangParam, getUrlWithoutLang } from '@/i18n/utils';
import { fetchTotalPages } from '@/lib/fetchCMSData';
import type { TotalPagesAllowedPostTypes } from '@/lib/fetchCMSData';
import { DEFAULT_POSTS_PER_PAGE } from '@/constants';
import { unprefixURI } from './utils-uri';

type PageRawStaticPaths = {
  __typename?: string;
  databaseId?: number;
  slug?: string;
  uri?: string;
  languageCode?: string;
  translations?: (PageRawStaticPaths | undefined)[];
  template?: {
    __typename?: string;
    templateName?: string;
  };
};

/**
 * Create static paths for single default page
 */
export function createSingleDefaultPageStaticPaths(
  staticPaths: PageRawStaticPaths[]
) {
  const finalPaths = [];

  for (const staticPath of staticPaths) {
    if (!staticPath?.languageCode || !staticPath?.uri) {
      continue;
    }

    finalPaths.push({
      params: {
        lang: getLangParam(staticPath.languageCode),
      },
    });
  }

  return finalPaths;
}

/**
 * Static Paths type with predefined `lang` param along with other params
 */
export type StaticPathsWithLang<
  OtherParams extends object = Record<string, never>,
> = {
  params: { lang: string | undefined } & OtherParams;
};

// TODO: we have to refactor this some day
type CreatePagesStaticPathsPayload<T extends string> = {
  /** Defines the param name, usually is the same as file name, eg. `[slug].astro`  */
  paramKey: T;
  customValidator?: (staticPath: PageRawStaticPaths) => boolean;
} & (
  | {
      /**
       *  Type of param value
       *  - `slug` - use it if you don't use hierarchical structure, eg. `[slug].astro`
       *  - `prefixed-uri` - use it for pages with parent static paths, eg. `[...uri].astro`, additional `uriPrefix` property must be used
       *  - `uri-without-lang` - use it for pages with parent static paths **without** prefix
       */
      paramValueType?: 'prefixed-uri';
      /** Prefix used in uri */
      uriPrefix: string;
    }
  | {
      paramValueType?: 'slug';
      uriPrefix?: never;
    }
  | {
      paramValueType?: 'uri';
      uriPrefix?: never;
    }
);

export function createPagesStaticPaths<T extends string>(
  paths: PageRawStaticPaths[],
  payload: CreatePagesStaticPathsPayload<T>
) {
  const { paramKey, paramValueType = 'slug', customValidator } = payload;
  const finalPaths = [];

  for (const staticPath of paths) {
    if (!staticPath.languageCode || !staticPath.uri || !staticPath.slug) {
      continue;
    }

    if (isFunction(customValidator) && !customValidator(staticPath)) continue;

    const uriWithoutLang = getUrlWithoutLang(staticPath.uri);
    let paramValue: string | undefined = '';
    if (paramValueType === 'prefixed-uri') {
      const { uriPrefix } = payload;
      if (!uriPrefix) continue;

      paramValue = unprefixURI(uriWithoutLang, uriPrefix);
    }

    if (paramValueType === 'slug') {
      paramValue = staticPath.slug;
    }

    if (paramValueType === 'uri') {
      paramValue = uriWithoutLang || undefined;
    }

    finalPaths.push({
      params: {
        lang: getLangParam(staticPath.languageCode),
        [paramKey]: paramValue,
      },
    } as StaticPathsWithLang<{ [Property in T]: string }>);
  }

  return finalPaths;
}

/**
 * Adds paged property to already generated static paths
 * @param generatedStaticPaths Static paths generated by {@link createSingleDefaultPageStaticPaths} or {@link createPagesStaticPaths} functions
 * @param totalPages Number of total pages
 * @returns
 */
export async function createPaginatedStaticPaths<
  T extends object = Record<string, string | number | undefined>,
>(
  generatedStaticPaths: StaticPathsWithLang<T>[],
  postType: TotalPagesAllowedPostTypes,
  postsPerPage: number = DEFAULT_POSTS_PER_PAGE
) {
  type R = T & { paged: number };
  const finalPaths: StaticPathsWithLang<R>[] = [];
  for (const staticPath of generatedStaticPaths) {
    const { lang } = staticPath.params;
    const totalPages = await fetchTotalPages(postType, {
      postsPerPage,
      lang,
    });

    // Start with `2` to omit `/page/1` generation
    for (let i = 2; i <= totalPages; i += 1) {
      for (const path of generatedStaticPaths) {
        const newPath = cloneDeep(path) as StaticPathsWithLang<R>;
        newPath.params.paged = i;

        finalPaths.push(newPath);
      }
    }
  }

  return finalPaths;
}
