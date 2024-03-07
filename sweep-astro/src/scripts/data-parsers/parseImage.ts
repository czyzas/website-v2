export type UnparsedImage =
  | {
      __typename?: string;
      node: {
        __typename?: string;
        altText?: string | undefined;
        sourceUrl?: string | undefined;
        mediaDetails?:
          | {
              __typename?: string;
              width?: number | undefined;
              height?: number | undefined;
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
};

export const parseImage = (unparsed: UnparsedImage): ParsedImage => ({
  shouldRender: !!unparsed?.node?.sourceUrl,
  url: unparsed?.node?.sourceUrl ?? '',
  alt: unparsed?.node.altText ?? '',
  width: unparsed?.node.mediaDetails?.width ?? 64,
  height: unparsed?.node.mediaDetails?.height ?? 64,
});
