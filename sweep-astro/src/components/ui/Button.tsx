import type { VariantProps } from 'class-variance-authority';
import type { ComponentPropsWithoutRef } from 'react';
import { cn } from '@/scripts/cn';
import { buttonVariants } from '../../styles/buttonVariants';
import Arrow from '@/assets/icons/arrow-right.svg?react';
import { Spinner } from '../Spinner';

interface ButtonProps
  extends ComponentPropsWithoutRef<'button'>,
    VariantProps<typeof buttonVariants> {
  arrow?: boolean;
  loading?: boolean;
}

export const Button = ({
  variant = 'primary',
  arrow = false,
  loading = false,
  className,
  children,
  ...rest
}: ButtonProps) => (
  <button
    {...rest}
    className={cn(
      buttonVariants({ variant }),
      { 'pointer-events-none': loading },
      className
    )}
  >
    {!loading ? children : <Spinner className={cn('h-5 w-5 animate-spin')} />}
    {!loading && arrow ? <Arrow className="size-[1.125em]" /> : null}
  </button>
);
