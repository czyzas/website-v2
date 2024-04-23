import { forwardRef, useEffect, useRef, useState } from 'react';
import type { ForwardedRef, InputHTMLAttributes } from 'react';
import { CommandList } from 'cmdk';
import { cn } from '@/scripts/cn';
import CaretDownIcon from '@/assets/icons/caret-down.svg?react';
import CheckIcon from '@/assets/icons/check.svg?react';
import { base } from '../styles';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../Select/Select';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from './Command';
import { Popover, PopoverContent, PopoverTrigger } from './Popover';

export interface ComboboxProps extends InputHTMLAttributes<HTMLSelectElement> {
  options: { value: string; label: string; keywords?: string[] }[];
  emptyText?: string;
  buttonClassName?: string;
  /** @default true */
  allowUnselect?: boolean;
  withSearch?: boolean;
  onValueChange?: (value: string) => void;
}

export const Combobox = forwardRef<HTMLSelectElement, ComboboxProps>(
  (
    {
      id,
      name,
      placeholder = '',
      defaultValue = '',
      className,
      options,
      emptyText,
      buttonClassName,
      allowUnselect = true,
      withSearch = true,
      onChange,
      onValueChange,
      ...rest
    }: ComboboxProps,
    ref: ForwardedRef<HTMLSelectElement>
  ) => {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(defaultValue);
    const [btnWidth, setBtnWidth] = useState(0);
    const btnRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
      const btn = btnRef.current;
      const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const { width } = entry.target.getBoundingClientRect();

          setBtnWidth(width);
        }
      });

      if (btn) {
        resizeObserver.observe(btn);
      }

      return () => {
        resizeObserver.disconnect();
      };
    }, [btnRef]);

    return (
      <div className={cn('combobox-container', 'relative', className)}>
        <select
          {...rest}
          aria-hidden="true"
          name={name}
          tabIndex={-1}
          style={{
            position: 'absolute',
            opacity: 0,
            width: 1,
            height: 1,
            pointerEvents: 'none',
            left: '50%',
            bottom: 0,
          }}
          value={value}
          onChange={(e) => {
            onChange?.(e);
            setValue(e.target.value);
          }}
          ref={ref}
        >
          <option value=""></option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {withSearch ? (
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <button
                ref={btnRef}
                id={id}
                type="button"
                // eslint-disable-next-line jsx-a11y/role-has-required-aria-props -- `aria-controls` property is set by PopoverTrigger
                role="combobox"
                aria-expanded={open}
                className={cn(
                  'combobox-trigger',
                  base,
                  'text-left flex items-center gap-2 justify-between',
                  { 'text-sw-text-subdued': !value },
                  buttonClassName
                )}
              >
                <span className="truncate min-h-[1.5em]">
                  {value
                    ? options.find((option) => option.value === value)?.label
                    : placeholder}
                </span>
                <CaretDownIcon className="size-4 shrink-0 text-sw-text-subdued" />
              </button>
            </PopoverTrigger>
            <PopoverContent
              style={
                { '--button-width': `${btnWidth}px` } as React.CSSProperties
              }
              className="w-[var(--radix-popper-anchor-width)] p-0"
            >
              <Command>
                <CommandInput placeholder="Search..." />
                <CommandList className="max-h-48 custom-scrollbar overflow-auto">
                  <CommandEmpty>
                    {emptyText ?? 'No entries found.'}
                  </CommandEmpty>
                  <CommandGroup>
                    {options.map((option) => (
                      <CommandItem
                        className={cn(
                          'flex items-center justify-between gap-2',
                          {
                            'text-sw-sky-400': value === option.value,
                          }
                        )}
                        data-active={value === option.value}
                        key={option.value}
                        value={option.value}
                        keywords={option.keywords}
                        onSelect={(currentValue) => {
                          setOpen(false);
                          if (
                            (allowUnselect && currentValue === value) ||
                            currentValue !== value
                          ) {
                            setValue(
                              currentValue === value ? '' : currentValue
                            );
                            onValueChange?.(
                              currentValue === value ? '' : currentValue
                            );
                          }
                        }}
                      >
                        {option.label}
                        <CheckIcon
                          className={cn(
                            'icon shrink-0 size-4',
                            value === option.value ? 'opacity-100' : 'opacity-0'
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        ) : (
          <Select>
            <SelectTrigger>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        )}
      </div>
    );
  }
);

Combobox.displayName = 'Combobox';
