import type { FileFragment } from '@/__generated__/cms';
import type { ReplaceTypenameLiteral, WithShouldRender } from '@/types';

export type UnparsedFile = ReplaceTypenameLiteral<FileFragment> | undefined;

export type ParsedFile = {
  url: string;
  title: string;
};

export const FileShouldRender = (unparsed: UnparsedFile) =>
  !!unparsed?.frontMediaItemUrl;

export const parseFile = (
  unparsed: UnparsedFile
): WithShouldRender<ParsedFile> => ({
  shouldRender: FileShouldRender(unparsed),
  url: unparsed?.frontMediaItemUrl ?? '',
  title: unparsed?.title ?? '',
});
