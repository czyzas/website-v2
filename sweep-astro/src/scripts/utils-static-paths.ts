import { cloneDeep, isFunction, omit } from 'lodash-es';
import { getLangParam, getUrlWithoutLang } from '@/i18n/utils';
import { unprefixURI } from './utils-uri';

export type RawDefaultPageStaticPaths = {
  __typename?: string;
  databaseId?: number;
  slug?: string | undefined;
  uri?: string | undefined;
  languageCode?: string | undefined;
  translations?: (RawDefaultPageStaticPaths | undefined)[];
};
export type DefaultPageStaticPaths = Omit<
  RawDefaultPageStaticPaths,
  'translations'
>[];
/**
 * Take raw page (page object + translations[]) from WP and return array of all pages
 * @example
 *
 * ```
 * const raw = {
 *   // original page
 *   translations: [
 *     // other translated pages
 *   ],
 * };
 *
 * const parsed = [
 *   // all pages inside array
 * ];
 * ```
 */
export function parseStaticPaths(
  rawStaticPaths: RawDefaultPageStaticPaths
): DefaultPageStaticPaths {
  const translations = rawStaticPaths?.translations ?? [];
  const originalPage = cloneDeep(omit(rawStaticPaths, 'translations'));

  return [originalPage, ...translations].filter(Boolean);
}

/**
 * Create static paths for single default page
 */
export function createSingleDefaultPageStaticPaths(
  staticPaths: DefaultPageStaticPaths
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

type PageStaticPaths = Array<{
  __typename?: string;
  databaseId: number;
  slug?: string;
  uri?: string;
  languageCode?: string;
  template?: {
    __typename?: string;
    templateName?: string;
  };
}>;

type PageStaticPathsResultItem<Type extends string> = {
  params: {
    lang: string | undefined;
  } & {
    [Property in Type]: string;
  };
};

type CreatePagesStaticPathsPayload<T extends string> = {
  /** Defines the param name, usually is the same as file name, eg. `[slug].astro`  */
  paramKey: T;
  customValidator?: (staticPath: PageStaticPaths[number]) => boolean;
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
  paths: PageStaticPaths,
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
    } as PageStaticPathsResultItem<T>);
  }

  return finalPaths;
}
