import { forwardRef } from 'react';
import type { ForwardedRef, InputHTMLAttributes } from 'react';
import { cn } from '@/scripts/cn';
import { base } from '../styles';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  onValueChange?: (value: string) => void;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { className, onChange, onValueChange, ...rest }: InputProps,
    ref: ForwardedRef<HTMLInputElement>
  ) => (
    <div className="input-container">
      <input
        {...rest}
        ref={ref}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          onChange?.(e);
          onValueChange?.(e.target.value);
        }}
        className={cn('input', base, className)}
      />
    </div>
  )
);

Input.displayName = 'Input';

export default Input;
