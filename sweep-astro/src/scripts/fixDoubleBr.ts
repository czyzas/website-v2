export function fixDoubleBr(str?: string) {
  if (!str) return '';

  const fixed = str.replace(/<br \/><br \/>\r\n/, '<br />');
  // console.log({ fix: str, fixed });

  return fixed;
}
