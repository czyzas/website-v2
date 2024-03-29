import type { ModulesModulesContentBackgroundColor } from '@/__generated__/cms';
import { cn } from '../cn';

export function parseBgColor(
  unparsedBackground?: ModulesModulesContentBackgroundColor
): string {
  const bg = unparsedBackground?.selectBackgroundColor ?? 'white';

  switch (bg) {
    case 'surface-background':
      return cn('bg-sw-surface-background');
    case 'surface-subdued':
      return cn('bg-sw-surface-subdued');
    default:
      return cn('bg-white');
  }
}
