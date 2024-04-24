import { cloneDeep, omit } from 'lodash-es';

type IRawStaticPaths = {
  __typename?: string;
  databaseId?: number;
  slug?: string | undefined;
  uri?: string | undefined;
  languageCode?: string | undefined;
  translations?: (IRawStaticPaths | undefined)[];
};
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
export function parseStaticPaths(rawStaticPaths: IRawStaticPaths) {
  const translations = rawStaticPaths?.translations ?? [];
  const originalPage = cloneDeep(omit(rawStaticPaths, 'translations'));

  return [originalPage, ...translations].filter(Boolean);
}
