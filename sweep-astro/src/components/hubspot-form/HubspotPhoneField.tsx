import { useCallback, useState } from 'react';
import { SwPhoneInput } from './ui/SwPhoneInput/SwPhoneInput';
import { makeInputId } from './shared';
import type { IFieldProps } from './shared';

export const HubspotPhoneField = ({
  formName,
  field,
  onInteracted,
  onChange,
  value,
  options,
}: IFieldProps) => {
  const [currentValue, setCurrentValue] = useState(value);

  const handleChange = useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      setCurrentValue(ev.currentTarget.value);
      onChange?.(ev);
    },
    [onChange]
  );

  if (!field.name) return null;

  return (
    <SwPhoneInput
      className={options.fieldClassName}
      // defaultValue={field.defaultValue ?? ''}
      disabled={!field.enabled}
      hidden={!!field.hidden}
      id={makeInputId(formName, field.name)}
      name={field.name}
      placeholder={field.placeholder ?? ''}
      required={!!field.required}
      value={currentValue as string}
      onChange={handleChange}
      onInput={onInteracted}
    />
  );
};
