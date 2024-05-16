import { cn } from '@/scripts/cn';

export const base = cn(
  'w-full text-black bg-white border border-sw-text-disabled shadow-button-secondary rounded-lg p-5 placeholder:text-sw-text-subdued'
);

export const selectOptionsWrapper = cn(
  'p-6 rounded-lg bg-white border border-sw-text-disabled shadow-button-secondary'
);

export const selectOptionsList = cn('py-2 px-3');
export const selectOptionItem = cn(
  'cursor-pointer py-1 typography-body text-sw-text-subdued data-[state=checked]:text-sw-sky-400 data-[highlighted]:text-sw-sky-400 aria-selected:text-sw-sky-400 data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50'
);
