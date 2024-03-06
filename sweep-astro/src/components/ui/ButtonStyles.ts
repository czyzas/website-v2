import { cva } from 'class-variance-authority';

export const buttonVariants = cva(
  [
    'button flex items-center justify-center gap-x-1 rounded-md text-sm font-medium whitespace-nowrap px-3 py-1 border border-transparent outline outline-2 outline-transparent outline-offset-2 focus-visible:outline-primary-500 disabled:pointer-events-none',
    'data-[icon]:bg-red-500',
  ],
  {
    variants: {
      variant: {
        primary: [
          'bg-blue-500',
          'text-slate-50',
          'hover:bg-blue-600',
          'disabled:opacity-30',
          'dark:hover:bg-blue-400',
          'dark:disabled:opacity-70',
          'dark:disabled:text-slate-500',
          'dark:disabled:bg-slate-800',
        ],
        bordered: [
          'bg-transparent',
          'border-slate-200',
          'text-slate-700',
          'hover:bg-slate-800/5',
          'disabled:text-slate-300',
          'dark:text-slate-100',
          'dark:hover:bg-slate-50/10',
          'dark:border-slate-700',
          'dark:disabled:text-slate-500',
        ],
        ghost: [
          'bg-transparent',
          'text-slate-700',
          'hover:bg-slate-800/5',
          'disabled:text-slate-300',
          'dark:text-slate-100',
          'dark:hover:bg-slate-50/10',
          'dark:disabled:text-slate-500',
        ],
      },
    },
  },
);
