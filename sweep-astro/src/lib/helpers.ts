import { cloneDeep, omit } from 'lodash-es';
import { getLangParam } from '@/i18n/utils';

export type IRawStaticPaths = {
  __typename?: string;
  databaseId?: number;
  slug?: string | undefined;
  uri?: string | undefined;
  languageCode?: string | undefined;
  translations?: (IRawStaticPaths | undefined)[];
};
export type IParsedStaticPaths = Omit<IRawStaticPaths, 'translations'>[];
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
  rawStaticPaths: IRawStaticPaths
): IParsedStaticPaths {
  const translations = rawStaticPaths?.translations ?? [];
  const originalPage = cloneDeep(omit(rawStaticPaths, 'translations'));

  return [originalPage, ...translations].filter(Boolean);
}

export function createSinglePageStaticPaths(fetcher: IParsedStaticPaths) {
  const finalPaths = [];
  const staticPaths = fetcher;
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
