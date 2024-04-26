export type WithAttributes<T> = astroHTML.JSX.IntrinsicAttributes & T;
type StringLiteralToString<T> = T extends string ? string : T;

export type ReplaceTypenameLiteral<ObjType extends object> = {
  [KeyType in keyof ObjType]: ObjType[KeyType] extends object
    ? ReplaceTypenameLiteral<ObjType[KeyType]>
    : StringLiteralToString<ObjType[KeyType]>;
};
