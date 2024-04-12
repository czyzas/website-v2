import { forwardRef, useRef, useState } from 'react';
import { cn } from '@/scripts/cn';
import Input from '../Input';
import type { InputProps } from '../Input';
import { Combobox } from '../Combobox/Combobox';
import countries from './countries';
import type { Country as CountryType, PhoneNumber } from './utils';
import {
  applyMask,
  getCountryByIso,
  getMaskDigit,
  replaceDialCode,
  splitPhoneNumber,
} from './utils';

export type SwPhoneInputProps = Omit<
  InputProps,
  'value' | 'defaultValue' | 'size' | 'color'
> & {
  value?: string;
  defaultValue?: string;
  defaultCountry?: CountryType[2];
};

const DEFAULT_PHONE_NUMBER = {
  raw: '',
  formatted: '',
  country: countries[0],
};

export const PhoneInput = forwardRef<
  HTMLInputElement,
  Omit<SwPhoneInputProps, 'size'>
>((props, ref) => {
  const { defaultCountry = 'fr', value, name, id, ...rest } = props;
  const inputRef = useRef<HTMLInputElement | null>(null);

  const defaultValue = props.defaultValue || value;
  const defaultPhoneNumber =
    (defaultValue
      ? splitPhoneNumber(defaultValue)
      : defaultCountry && {
          raw: '',
          formatted: '',
          country: getCountryByIso(defaultCountry),
        }) || DEFAULT_PHONE_NUMBER;

  const [phoneNumberValue, setPhoneNumberValue] =
    useState<PhoneNumber>(defaultPhoneNumber);

  const handleChange = (phoneNumber: PhoneNumber) => {
    setPhoneNumberValue(phoneNumber);

    if (inputRef.current !== null) {
      // Hack to trigger React change event
      // src: https://stackoverflow.com/a/46012210
      const input = inputRef.current;
      const newValue = phoneNumber.raw;
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        'value'
      )!.set;

      nativeInputValueSetter!.call(input, newValue);
      const event = new Event('input', { bubbles: true });
      input.dispatchEvent(event);
    }
  };

  const selectOptions = countries.map((country) => ({
    value: country[2],
    label: `${country[0]} (+${country[3]})`,
    keywords: [country[0].toLowerCase()],
  }));

  return (
    <div className="phone-input grid grid-cols-[minmax(auto,12rem)_1fr] gap-4">
      <input
        aria-hidden={'true'}
        name={name}
        style={{ display: 'none' }}
        type={'tel'}
        {...rest}
        defaultValue={defaultPhoneNumber.raw}
        ref={(r) => {
          if (typeof ref === 'function') {
            ref(r);
          }
          inputRef.current = r;
        }}
      />
      <Combobox
        buttonClassName={cn('truncate')}
        options={selectOptions}
        allowUnselect={false}
        onValueChange={(val) => {
          const country = getCountryByIso(val as CountryType[2]);

          const raw = phoneNumberValue.raw
            ? replaceDialCode(
                phoneNumberValue.raw,
                phoneNumberValue.country[3],
                `+${country[3]}`
              )
            : `+${country[3]}`;

          setPhoneNumberValue({
            formatted: applyMask(phoneNumberValue.formatted, country[4]),
            raw,
            country,
          });
        }}
      />
      <Input
        ref={inputRef}
        {...rest}
        id={id}
        type={'tel'}
        value={phoneNumberValue.formatted}
        onChange={(e) => {
          props.onChange?.(e);

          handleChange({
            ...phoneNumberValue,
            raw: `+${
              phoneNumberValue.country[3]
            }${getMaskDigit(e.target.value, phoneNumberValue.country[4])}`,
            formatted: applyMask(e.target.value, phoneNumberValue.country[4]),
          });
        }}
      />
    </div>
  );
});

PhoneInput.displayName = 'PhoneInput';
