export type UnparsedSectionTitle =
  | {
      __typename?: string | undefined;
      title?: string | undefined;
      overline?: string | undefined;
    }
  | undefined;

export type ParsedSectionTitle = {
  title: string;
  overline: string;
};

export const parseSectionTitle = (
  unparsed: UnparsedSectionTitle,
): ParsedSectionTitle => ({
  title: unparsed?.title ?? '',
  overline: unparsed?.overline ?? '',
});
