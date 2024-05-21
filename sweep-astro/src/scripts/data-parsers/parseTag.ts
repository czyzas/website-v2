import type { TagFragment } from '@/__generated__/cms';
import type { ReplaceTypenameLiteral, WithShouldRender } from '@/types';
import type { TagColor } from '@/styles/tagVariants';

export type UnparsedTag = ReplaceTypenameLiteral<TagFragment> | undefined;
export type ParsedTag = { name: string; color: TagColor };

export const tagShouldRender = (unparsed: UnparsedTag) => !!unparsed?.name;
export const parseTag = (
  unparsed: UnparsedTag
): WithShouldRender<ParsedTag> => ({
  shouldRender: tagShouldRender(unparsed),
  name: unparsed?.name ?? '',
  color: (unparsed?.tagTaxonomyAcf?.tagColor ?? 'gray') as TagColor,
});

export const parseTags = (
  unparsedTags: UnparsedTag[] | undefined
): WithShouldRender<ParsedTag>[] => {
  if (!unparsedTags) return [];

  return unparsedTags.filter(Boolean).map(parseTag);
};
