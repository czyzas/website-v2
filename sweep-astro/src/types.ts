// UTILS
export type WithAttributes<T> = astroHTML.JSX.IntrinsicAttributes & T;
type StringLiteralToString<T> = T extends string ? string : T;

export type WithShouldRender<T> = { shouldRender: boolean } & T;

export type ReplaceTypenameLiteral<ObjType extends object> = {
  [KeyType in keyof ObjType]: ObjType[KeyType] extends object
    ? ReplaceTypenameLiteral<ObjType[KeyType]>
    : StringLiteralToString<ObjType[KeyType]>;
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
