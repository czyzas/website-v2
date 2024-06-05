import { cva } from 'class-variance-authority';

export const buttonVariants = cva(
  [
    'button inline-flex items-center justify-center gap-x-1 whitespace-nowrap rounded-lg border border-transparent px-3 py-2 text-base font-medium transition-colors',
  ],
  {
    variants: {
      variant: {
        primary: [
          'bg-sw-sky-400',
          'text-white',
          'hover:bg-sw-sky-500',
          'shadow-button',
        ],
        secondary: [
          'bg-white',
          'border-sw-border',
          'shadow-button-secondary',
          'text-black',
          'hover:bg-sw-surface-subdued',
        ],
        destructive: [
          'bg-sw-fire-400',
          'text-white',
          'hover:bg-sw-fire-500',
          'shadow-button',
        ],
      },
    },
  }
);
