import type { HTMLInputTypeAttribute } from 'react';
import React, { useCallback, useState } from 'react';
import SwInput, { SwInputKind } from '../bedrock/form/SwInput';
import { SwPhoneInput } from '../bedrock/form/SwPhoneInput';
import type { IFieldProps } from './HubspotFormFieldFactory';
import { registerFieldTypeHandler } from './HubspotFormFieldFactory';
import type { IHubspotFormFieldDefinition } from './shared';
import { makeInputId } from './shared';

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

  return (
    <SwInput
      className={options.fieldClassName}
      defaultValue={field.defaultValue}
      disabled={!field.enabled}
      helperText={field.description}
      hidden={field.hidden}
      id={makeInputId(formName, field.name)}
      inputProps={{
        hidden: field.hidden,
        pattern:
          field.name === 'email'
            ? '^(?!.*@(gmail.|yahoo.|hotmail.|outlook.|icloud.|free.)).*$'
            : undefined,
        title:
          field.name === 'email'
            ? 'Please enter a business email address'
            : undefined,
      }}
      isFullWidth={true}
      kind={SwInputKind.Default}
      name={field.name}
      placeholder={field.placeholder}
      required={field.required}
      style={{ display: field.hidden ? 'none' : undefined }}
      type={calculateInputType(field)}
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

  return (
    <SwPhoneInput
      className={options.fieldClassName}
      defaultValue={field.defaultValue}
      disabled={!field.enabled}
      hidden={field.hidden}
      id={makeInputId(formName, field.name)}
      kind={SwInputKind.Default}
      name={field.name}
      placeholder={field.placeholder}
      required={field.required}
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
