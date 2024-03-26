import type { ImageFragment } from '@/__generated__/cms';
import type { ReplaceTypenameLiteral } from '@/types';

type UnparsedImage = ReplaceTypenameLiteral<ImageFragment> | undefined;

export const imageShouldRender = (unparsed: UnparsedImage) =>
  !!unparsed?.node.sourceUrl;

export const parseImage = (unparsed: UnparsedImage) => {
  const DEFAULT_SIZE = 375;
  return {
    shouldRender: imageShouldRender(unparsed),
    url: unparsed?.node?.sourceUrl ?? '',
    alt: unparsed?.node?.altText ?? '',
    width: unparsed?.node?.mediaDetails?.width ?? DEFAULT_SIZE,
    height: unparsed?.node?.mediaDetails?.height ?? DEFAULT_SIZE,
    sizes: unparsed?.node?.sizes ?? '',
    isSvg: unparsed?.node?.mimeType === 'image/svg+xml',
  };
};
