import { cn } from '@/scripts/cn';

export const base = cn(
  'w-full rounded-lg border border-sw-text-disabled bg-white p-5 text-black shadow-button-secondary placeholder:text-sw-text-subdued'
);

export const selectOptionsWrapper = cn(
  'rounded-lg border border-sw-text-disabled bg-white p-6 shadow-button-secondary'
);

export const selectOptionsList = cn('px-3 py-2');
export const selectOptionItem = cn(
  'typography-body cursor-pointer py-1 text-sw-text-subdued aria-selected:text-sw-sky-400 data-[disabled=true]:pointer-events-none data-[highlighted]:text-sw-sky-400 data-[state=checked]:text-sw-sky-400 data-[disabled=true]:opacity-50'
);
