import type React from 'react';
import { useCallback, useEffect, useState } from 'react';
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

  if (!field.name) return null;

  return (
    <>
      <textarea
        className={options.fieldClassName}
        defaultValue={field.defaultValue ?? ''}
        disabled={!field.enabled}
        hidden={!!field.hidden}
        id={makeInputId(formName, field.name)}
        name={field.name}
        placeholder={field.placeholder ?? ''}
        required={!!field.required}
        rows={4}
        value={currentValue}
        onChange={handleChange}
        onInput={onInteracted}
      >
        {currentValue}
      </textarea>
      {field.description ? (
        <span className="helper-text">{field.description}</span>
      ) : null}
    </>
  );
};

export function registerTextAreaField(): void {
  registerFieldTypeHandler('textarea', HubspotTextareaField);
}
