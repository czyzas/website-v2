import type { HTMLInputTypeAttribute } from 'react';
import { useCallback, useState } from 'react';
// import { SwPhoneInput } from '../bedrock/form/SwPhoneInput';
import type { IFieldProps } from './HubspotFormFieldFactory';
import { registerFieldTypeHandler } from './HubspotFormFieldFactory';
import type { IHubspotFormFieldDefinition } from './shared';
import { makeInputId } from './shared';
import Input from './ui/Input';
import { SwPhoneInput } from './ui/SwPhoneInput/SwPhoneInput';

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

const HubspotTextField: React.FC<IFieldProps> = ({
  formName,
  field,
  onInteracted,
  onChange,
  value,
  options,
}) => {
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
    <Input
      className={options.fieldClassName}
      defaultValue={field.defaultValue ?? ''}
      disabled={!field.enabled}
      helperText={field.description ?? ''}
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
      placeholder={field.placeholder ?? ''}
      required={!!field.required}
      type={calculateInputType(field) ?? 'text'}
      value={currentValue}
      onChange={handleChange}
      onInput={onInteracted}
    />
  );
};

const HubspotPhoneField: React.FC<IFieldProps> = ({
  formName,
  field,
  onInteracted,
  onChange,
  value,
  options,
}) => {
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
      defaultValue={field.defaultValue ?? ''}
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

export function registerHubspotTextField(): void {
  registerFieldTypeHandler('text', HubspotTextField);
  registerFieldTypeHandler('number', HubspotTextField);
  registerFieldTypeHandler('phonenumber', HubspotPhoneField);
}
