import type React from 'react';
import { useCallback, useEffect, useState } from 'react';
import SwInput, { SwInputKind } from '../bedrock/form/SwInput';
import type { IFieldProps } from './HubspotFormFieldFactory';
import { registerFieldTypeHandler } from './HubspotFormFieldFactory';
import { makeInputId } from './shared';

const HubspotTextareaField: React.FC<IFieldProps> = ({
  formName,
  field,
  onInteracted,
  onChange,
  value,
  options,
}) => {
  const [currentValue, setCurrentValue] = useState(value);
  useEffect(() => setCurrentValue(value), [value]);
  const handleChange = useCallback(
    (ev: React.ChangeEvent<HTMLTextAreaElement>) => {
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
      inputProps={{ hidden: field.hidden }}
      isFullWidth={true}
      kind={SwInputKind.Default}
      multiline={true}
      name={field.name}
      placeholder={field.placeholder}
      required={field.required}
      rows={4}
      type={'text'}
      value={currentValue}
      onChange={handleChange}
      onInput={onInteracted}
    />
  );
};

export function registerTextAreaField(): void {
  registerFieldTypeHandler('textarea', HubspotTextareaField);
}
