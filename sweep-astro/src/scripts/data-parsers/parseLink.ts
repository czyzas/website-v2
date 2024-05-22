import type { LinkFragment } from '@/__generated__/cms';
import type { ReplaceTypenameLiteral, WithShouldRender } from '@/types';

export type UnparsedLink = ReplaceTypenameLiteral<LinkFragment> | undefined;

export type ParsedLink = {
  url: string;
  title: string;
  target?: string;
};

export const linkShouldRender = (unparsed: UnparsedLink) => !!unparsed?.url;

export const parseLink = (
  unparsed: UnparsedLink
): WithShouldRender<ParsedLink> => ({
  shouldRender: linkShouldRender(unparsed),
  url: unparsed?.internalUrl ?? unparsed?.url ?? '',
  title: unparsed?.title ?? '',
  target: unparsed?.target,
});
