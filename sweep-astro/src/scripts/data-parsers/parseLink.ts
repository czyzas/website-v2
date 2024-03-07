export type UnparsedLink =
  | {
      __typename?: string | undefined;
      url?: string | undefined;
      title?: string | undefined;
      target?: string | undefined;
    }
  | undefined;

export type ParsedLink = {
  shouldRender: boolean;
  url: string;
  title: string;
  target?: string;
};

export const parseLink = (unparsed: UnparsedLink): ParsedLink => ({
  shouldRender: !!unparsed?.url,
  url: unparsed?.url ?? '',
  title: unparsed?.title ?? '',
  target: unparsed?.target,
});
