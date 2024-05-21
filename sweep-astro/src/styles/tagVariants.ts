import { cva } from 'class-variance-authority';
import type { VariantProps } from 'class-variance-authority';

export const tagVariants = cva(
  [
    'article-tag',
    'text-xs',
    'font-bold',
    'uppercase',
    'inline-flex',
    'py-[0.1875rem]',
    'px-2',
    'rounded-lg',
    'border border-transparent',
    'text-sw-text-subdued',
    'bg-sw-border',
  ],
  {
    variants: {
      color: {
        green: ['text-sw-grass-500', 'bg-sw-grass-100'],
        algea: ['text-sw-algea-500', 'bg-sw-algea-100'],
        red: ['text-sw-fire-500', 'bg-sw-fire-100'],
        destructive: ['text-sw-action-destructive', 'bg-sw-fire-200'],
        sea: ['text-sw-sea-500', 'bg-sw-sea-100'],
        blue: ['text-sw-glacier-500', 'bg-sw-glacier-100'],
        yellow: ['text-sw-crop-500', 'bg-sw-crop-100'],
        glacier: ['text-sw-glacier-500', 'bg-sw-glacier-200'],
        coral: ['text-sw-coral-500', 'bg-sw-coral-100'],
        flower: ['text-sw-flower-500', 'bg-sw-flower-100'],
        gray: ['text-sw-text-subdued', 'bg-sw-border'],
        'gray-outline': [
          'text-sw-text-subdued',
          'bg-transparent',
          'border-sw-gray-500',
        ],
      },
    },
  }
);

export type TagColor = VariantProps<typeof tagVariants>['color'];
