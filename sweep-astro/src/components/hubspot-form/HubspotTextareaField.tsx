import type React from 'react';
import { useCallback, useEffect, useState } from 'react';
import { cn } from '@/scripts/cn';
import { makeInputId } from './shared';
import type { IFieldProps } from './shared';
import { base } from './ui/styles';

export const HubspotTextareaField = ({
  formName,
  field,
  onInteracted,
  onChange,
  value,
  options,
}: IFieldProps) => {
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
        className={cn('textarea', base, options.fieldClassName)}
        // defaultValue={field.defaultValue ?? ''}
        disabled={!field.enabled}
        hidden={!!field.hidden}
        id={makeInputId(formName, field.name)}
        name={field.name}
        placeholder={
          (field.label ?? field.placeholder ?? '') + (field.required ? '*' : '')
        }
        required={!!field.required}
        rows={4}
        value={currentValue}
        onChange={handleChange}
        onInput={onInteracted}
      />
      {field.description ? (
        <span className="helper-text">{field.description}</span>
      ) : null}
    </>
  );
};
