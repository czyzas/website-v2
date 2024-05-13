import type { ComponentProps } from 'astro/types';
import type { TagFragment } from '@/__generated__/cms';
import type ArticleTag from '@/components/ArticleTag.astro';
import type { ReplaceTypenameLiteral } from '@/types';

export type UnparsedTag = ReplaceTypenameLiteral<TagFragment> | undefined;
export type ParsedTag = { name: string; color: TagColor };
type TagColor = ComponentProps<typeof ArticleTag>['color'];

export const tagShouldRender = (unparsed: UnparsedTag) => !!unparsed?.name;
export const parseTag = (
  unparsed: UnparsedTag
): { shouldRender: boolean } & ParsedTag => {
  console.log(unparsed?.tagTaxonomyAcf?.tagColor);
  return {
    shouldRender: tagShouldRender(unparsed),
    name: unparsed?.name ?? '',
    color: (unparsed?.tagTaxonomyAcf?.tagColor ?? 'gray') as TagColor,
  };
};

export const parseTags = (
  unparsedTags: UnparsedTag[] | undefined
): ({ shouldRender: boolean } & ParsedTag)[] => {
  if (!unparsedTags) return [];

  return unparsedTags.filter(Boolean).map(parseTag);
};
