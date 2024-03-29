import type { LinkFragment } from '@/__generated__/cms';
import type { ReplaceTypenameLiteral } from '@/types';

export type UnparsedLink = ReplaceTypenameLiteral<LinkFragment> | undefined;

export type ParsedLink = {
  shouldRender: boolean;
  url: string;
  title: string;
  target?: string;
};

export const linkShouldRender = (unparsed: UnparsedLink) => !!unparsed?.url;

export const parseLink = (unparsed: UnparsedLink): ParsedLink => ({
  shouldRender: linkShouldRender(unparsed),
  url: unparsed?.url ?? '',
  title: unparsed?.title ?? '',
  target: unparsed?.target,
});
