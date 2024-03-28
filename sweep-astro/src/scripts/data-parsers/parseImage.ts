import type { ImageFragment } from '@/__generated__/cms';
import type { ReplaceTypenameLiteral } from '@/types';

export type UnparsedImage = ReplaceTypenameLiteral<ImageFragment> | undefined;

export type ParsedImage = {
  shouldRender: boolean;
  url: string;
  alt: string;
  width: number;
  height: number;
  isSvg: boolean;
};

export const imageShouldRender = (unparsed: UnparsedImage) =>
  !!unparsed?.node.sourceUrl;

export const parseImage = (unparsed: UnparsedImage): ParsedImage => {
  const DEFAULT_SIZE = 375;
  return {
    shouldRender: imageShouldRender(unparsed),
    url: unparsed?.node?.sourceUrl ?? '',
    alt: unparsed?.node?.altText ?? '',
    width: unparsed?.node?.mediaDetails?.width ?? DEFAULT_SIZE,
    height: unparsed?.node?.mediaDetails?.height ?? DEFAULT_SIZE,
    isSvg: unparsed?.node?.mimeType === 'image/svg+xml',
  };
};
