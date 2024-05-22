import type { ReusableFieldsSelectSectionTitle } from '@/__generated__/cms';
import type { ReplaceTypenameLiteral, WithShouldRender } from '@/types';

export type UnparsedSectionTitle =
  | ReplaceTypenameLiteral<ReusableFieldsSelectSectionTitle>
  | undefined;

export type ParsedSectionTitle = {
  tag: string;
  hasCustomStyle: boolean;
  displayAs: string;
  headline: string;
  overline: string;
  textUnder: string;
};

export const sectionTitleShouldRender = (unparsed: UnparsedSectionTitle) =>
  !!unparsed?.headline?.length;

export const parseSectionTitle = (
  unparsed: UnparsedSectionTitle
): WithShouldRender<ParsedSectionTitle> => ({
  shouldRender: sectionTitleShouldRender(unparsed),
  tag: unparsed?.headlineType ?? 'h2',
  hasCustomStyle: unparsed?.customStyle ?? false,
  displayAs: unparsed?.displayAs ?? unparsed?.headlineType ?? 'h2',
  overline: unparsed?.overline ?? '',
  headline: unparsed?.headline ?? '',
  textUnder: unparsed?.textUnder ?? '',
});
