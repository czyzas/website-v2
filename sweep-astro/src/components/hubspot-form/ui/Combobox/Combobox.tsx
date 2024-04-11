import { forwardRef, useState } from 'react';
import type { ForwardedRef, InputHTMLAttributes } from 'react';
import { CommandList } from 'cmdk';
import { cn } from '@/scripts/cn';
import { base } from '../styles';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from './Command';
import { Popover, PopoverContent, PopoverTrigger } from './Popover';

export interface ComboboxProps extends InputHTMLAttributes<HTMLInputElement> {
  options: { value: string; label: string }[];
  emptyText?: string;
}

export const Combobox = forwardRef<HTMLInputElement, ComboboxProps>(
  (
    {
      options,
      name,
      id,
      placeholder = 'Select',
      emptyText,
      ...rest
    }: ComboboxProps,
    ref: ForwardedRef<HTMLInputElement>
  ) => {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState('');

    return (
      <>
        <input
          {...rest}
          type="text"
          aria-hidden="true"
          id={id}
          name={name}
          hidden
          style={{ display: 'none' }}
          value={value}
          ref={ref}
        />
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <button
              // variant="outline"
              type="button"
              // eslint-disable-next-line jsx-a11y/role-has-required-aria-props -- `aria-controls` property is set by PopoverTrigger
              role="combobox"
              aria-expanded={open}
              className={cn(
                'combobox-trigger',
                base,
                'text-left flex gap-2 justify-between'
              )}
            >
              {value
                ? options.find((option) => option.value === value)?.label
                : placeholder}
              <span className="h-4 w-4 shrink-0 opacity-50">
                c {/* ChevronsUpDown */}
              </span>
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <Command>
              <CommandInput placeholder={placeholder} />
              <CommandList className="max-h-48 custom-scrollbar overflow-auto">
                <CommandEmpty>{emptyText ?? 'No entries found.'}</CommandEmpty>
                <CommandGroup>
                  {options.map((option) => (
                    <CommandItem
                      key={option.value}
                      value={option.value}
                      onSelect={(currentValue) => {
                        setValue(currentValue === value ? '' : currentValue);
                        setOpen(false);
                      }}
                    >
                      <span
                        className={cn(
                          'mr-2 h-4 w-4',
                          value === option.value ? 'opacity-100' : 'opacity-0'
                        )}
                      >
                        c {/* Check */}
                      </span>
                      {option.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </>
    );
  }
);

Combobox.displayName = 'Combobox';
