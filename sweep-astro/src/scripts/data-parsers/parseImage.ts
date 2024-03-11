export type UnparsedImage =
  | {
      __typename?: string;
      node: {
        __typename?: string;
        altText?: string | undefined;
        sourceUrl?: string | undefined;
        sizes?: string | undefined;
        mediaDetails?:
          | {
              __typename?: string;
              width?: number | undefined;
              height?: number | undefined;
              sizes?:
                | Array<
                    | {
                        __typename?: string;
                        width?: string | undefined;
                        height?: string | undefined;
                        name?: string | undefined;
                        sourceUrl?: string | undefined;
                      }
                    | undefined
                  >
                | undefined;
            }
          | undefined;
      };
    }
  | undefined;

export type ParsedImage = {
  shouldRender: boolean;
  url: string;
  alt: string;
  width: number;
  height: number;
  sizes: string;
};

export const parseImage = (unparsed: UnparsedImage): ParsedImage => {
  // TODO: handle different image sizes
  const imageSizes = unparsed?.node.mediaDetails?.sizes ?? [];
  return {
    shouldRender: !!unparsed?.node?.sourceUrl,
    url: unparsed?.node?.sourceUrl ?? '',
    alt: unparsed?.node.altText ?? '',
    width: unparsed?.node.mediaDetails?.width ?? 0,
    height: unparsed?.node.mediaDetails?.height ?? 0,
    sizes: unparsed?.node.sizes ?? '',
  };
};
