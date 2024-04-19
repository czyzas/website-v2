export function fixDoubleBr(str?: string) {
  if (!str) return '';

  return str.replace(/<br \/><br \/>\r\n/, '<br />');
}
