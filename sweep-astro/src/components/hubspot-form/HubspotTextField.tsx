import type { HTMLInputTypeAttribute } from 'react';
import { useCallback, useState } from 'react';
import type { IFieldProps, IHubspotFormFieldDefinition } from './shared';
import { makeInputId } from './shared';
import Input from './ui/Input/Input';

function calculateInputType(
  field: IHubspotFormFieldDefinition
): HTMLInputTypeAttribute | undefined | null {
  const { name, type } = field;
  switch (type) {
    case 'string':
      if (name === 'email') {
        return 'email';
      }
      break;

    case 'phonenumber':
      return 'tel';

    case 'number':
      return 'number';

    default:
      return type;
  }

  return type;
}

export const HubspotTextField = ({
  formName,
  field,
  onInteracted,
  onChange,
  value,
  options,
}: IFieldProps) => {
  const [currentValue, setCurrentValue] = useState(() => {
    if (field.name === 'form_name') {
      return formName;
    }
    return field.defaultValue || value;
  });

  const handleChange = useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      setCurrentValue(ev.currentTarget.value);
      onChange?.(ev);
    },
    [onChange]
  );
  if (!field.name) return null;

  return (
    <Input
      className={options.fieldClassName}
      disabled={!field.enabled}
      hidden={!!field.hidden}
      id={makeInputId(formName, field.name)}
      name={field.name}
      pattern={
        field.name === 'email'
          ? '^(?!.*@(gmail.|yahoo.|hotmail.|outlook.|icloud.|free.)).*$'
          : undefined
      }
      title={
        field.name === 'email'
          ? 'Please enter a business email address'
          : undefined
      }
      placeholder={
        (field.label ?? field.placeholder ?? '') + (field.required ? '*' : '')
      }
      required={!!field.required}
      type={calculateInputType(field) ?? 'text'}
      value={currentValue}
      onChange={handleChange}
      onInput={onInteracted}
    />
  );
};
