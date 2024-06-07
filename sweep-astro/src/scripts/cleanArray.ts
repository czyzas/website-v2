export function cleanArray<T>(array?: T[] | undefined[]) {
  if (!array) return [];

  return array.filter(Boolean);
}
