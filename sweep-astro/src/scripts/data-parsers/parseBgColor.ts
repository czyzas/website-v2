import type { ModulesModulesContentBackgroundColor } from '@/__generated__/cms';
import { cn } from '../cn';

export type AvailableBgColor =
  | 'surface-background'
  | 'surface-subdued'
  | 'white';

export function getBgColor(color: AvailableBgColor) {
  switch (color) {
    case 'surface-background':
      return cn('bg-sw-surface-background');
    case 'surface-subdued':
      return cn('bg-sw-surface-subdued');
    default:
      return cn('bg-white');
  }
}

export function parseBgColor(
  unparsedBackground?: ModulesModulesContentBackgroundColor
) {
  const bg = unparsedBackground?.selectBackgroundColor ?? 'white';

  return bg as AvailableBgColor;
}
