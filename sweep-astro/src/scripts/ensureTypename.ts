type ObjectWithTypename<F extends string> = {
  __typename: F;
  [key: string]: unknown;
};

export const ensureTypename = <
  F extends string,
  T extends ObjectWithTypename<F>,
>(
  item: T | undefined,
  type: T['__typename'],
): T | undefined => {
  if (item && '__typename' in item && item.__typename === type) return item;

  return undefined;
};
