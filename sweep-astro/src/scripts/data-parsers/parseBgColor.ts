import type { ModulesModulesContentBackgroundColor } from '@/__generated__/cms';
import { cn } from '../cn';

export type AvailableBgColor =
  | 'surface-background'
  | 'surface-subdued'
  | 'white'
  | 'none';

export function getBgColor(color: AvailableBgColor) {
  switch (color) {
    case 'surface-background':
      return cn('bg-sw-surface-background');
    case 'surface-subdued':
      return cn('bg-sw-surface-subdued');
    case 'white':
      return cn('bg-white');
    default:
      return '';
  }
}

export function parseBgColor(
  unparsedBackground?: ModulesModulesContentBackgroundColor
) {
  const bg = unparsedBackground?.selectBackgroundColor ?? 'none';

  return bg as AvailableBgColor;
}
