import type { PageTranslationsFragment } from './__generated__/cms';
import type { UnparsedLink } from './scripts/data-parsers/parseLink';

// UTILS
type OmitDistributive<T, K extends PropertyKey> = T extends unknown
  ? T extends object
    ? OmitRecursively<T, K>
    : T
  : never;
export type OmitRecursively<T, K extends PropertyKey> = Omit<
  { [P in keyof T]: OmitDistributive<T[P], K> },
  K
>;
export type WithAttributes<T> = astroHTML.JSX.IntrinsicAttributes & T;
type StringLiteralToString<T> = T extends string ? string : T;

export type WithShouldRender<T> = { shouldRender: boolean } & T;

export type ReplaceTypenameLiteral<ObjType extends object> = {
  [KeyType in keyof ObjType]: ObjType[KeyType] extends object
    ? ReplaceTypenameLiteral<ObjType[KeyType]>
    : StringLiteralToString<ObjType[KeyType]>;
};

export type ReplaceTypenameLiteral2<T> = {
  [K in keyof T]: StringLiteralToString<ReplaceTypenameLiteral2<T[K]>>;
};

export type DeepRequired<T> = {
  [K in keyof T]-?: Required<DeepRequired<T[K]>>;
};

export type NonNullableProperties<ObjType extends object> = {
  [KeyType in keyof ObjType]-?: ObjType[KeyType] extends object
    ? NonNullableProperties<ObjType[KeyType]>
    : NonNullable<ObjType[KeyType]>;
};

// eslint-disable-next-line @typescript-eslint/ban-types -- https://x.com/mattpocockuk/status/1653403198885904387
export type Prettify<T extends object> = {} & {
  [K in keyof T]: T[K];
};

// eslint-disable-next-line @typescript-eslint/ban-types -- Use `string & {}` for strings with autocomplete (src: https://stackoverflow.com/a/75265010)
export type StringAutocomplete<T extends string> = T | (string & {});

// TYPES
export type ColumnSizes = '5-7' | '6-6' | '7-5';

export type ModuleMeta = {
  index: number;
  moduleType: 'default' | 'article';
};
export type WithModuleMeta<T> = { __meta__: ModuleMeta } & T;

export type ITableOfContentsEntry = {
  level: number;
  id: string;
  label: string;
  children?: ITableOfContentsEntry[];
};

export interface FilterTag {
  name?: string;
  slug?: string;
}

export type PageTranslations =
  ReplaceTypenameLiteral<PageTranslationsFragment>[];

export type BreadcrumbsType = [...UnparsedLink[], string];
