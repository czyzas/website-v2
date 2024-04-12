import type { VariantProps } from 'class-variance-authority';
import type { ComponentPropsWithoutRef } from 'react';
import { cn } from '@/scripts/cn';
import { buttonVariants } from './buttonVariants';

interface ButtonProps
  extends ComponentPropsWithoutRef<'button'>,
    VariantProps<typeof buttonVariants> {}

export const Button = ({
  variant = 'primary',
  className,
  ...rest
}: ButtonProps) => (
  <button {...rest} className={cn(buttonVariants({ variant }), className)} />
);
