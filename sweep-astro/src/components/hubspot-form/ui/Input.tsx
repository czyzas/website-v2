import { forwardRef } from 'react';
import type { ForwardedRef, InputHTMLAttributes } from 'react';
import { cn } from '@/scripts/cn';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  dataTestId?: string;
  onValueChange?: (value: string) => void;
  helperText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      dataTestId,
      helperText,
      onChange,
      onValueChange,
      ...rest
    }: InputProps,
    ref: ForwardedRef<HTMLInputElement>
  ) => (
    <div>
      <input
        {...rest}
        ref={ref}
        data-text-id={dataTestId ?? 'textField'}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          onChange?.(e);
          onValueChange?.(e.target.value);
        }}
        className={cn('input', className)}
      />
      {helperText ? <div className="helper-text">{helperText}</div> : null}
    </div>
  )
);

Input.displayName = 'Input';

export default Input;
