import { useCallback, useEffect, useMemo, useState } from 'react';
import { cn } from '@/scripts/cn';
import type {
  IFieldProps,
  IHubspotFormFormFieldOptionsDefinition,
} from './shared';
import { makeInputId } from './shared';

function buildSet(value?: string): ReadonlyArray<string> {
  if (!value || value.length === 0) {
    return [];
  }

  return value?.split(';') || [];
}

function addValue(
  current: ReadonlyArray<string>,
  value: string
): ReadonlyArray<string> {
  if (current.includes(value)) {
    return current;
  }

  return [...current, value];
}

function removeValue(
  current: ReadonlyArray<string>,
  value: string
): ReadonlyArray<string> {
  const index = current.indexOf(value);

  if (index < 0) {
    return current;
  }

  return current.filter((_, i) => i !== index);
}

export const HubspotCheckboxField = ({
  formName,
  field,
  onInteracted,
  onChange,
  value,
  options,
}: IFieldProps) => {
  const [currentValue, setCurrentValue] = useState(() =>
    buildSet(value as string)
  );
  useEffect(() => setCurrentValue(buildSet(value as string)), [value]);

  const handleChange = useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      const input = ev.currentTarget;
      const { checked, value } = input;

      setCurrentValue((current) => {
        const newValue = checked
          ? addValue(current, value)
          : removeValue(current, value);

        return newValue;
      });
      onChange?.(ev);
    },
    [onChange]
  );

  const currentStringValue = useMemo(
    () => currentValue.join(';'),
    [currentValue]
  );

  const { options: fieldOptions } = field;
  if (!fieldOptions) {
    return null;
  }

  return (
    <div className={options.checkboxContainerClassName}>
      <input
        id={makeInputId(formName, field.name)}
        name={field.name ?? undefined}
        type={'hidden'}
        value={currentStringValue}
      />
      {(
        fieldOptions.filter(
          (o) => o?.value
        ) as ReadonlyArray<IHubspotFormFormFieldOptionsDefinition>
      ).map((option) => {
        const { value } = option;
        const checked = !!value && currentValue.includes(value);

        return (
          <div className="flex items-center gap-2" key={value}>
            <input
              type="checkbox"
              checked={checked}
              className={options.checkboxFieldClassName}
              id={makeInputId(formName, field.name)}
              aria-label={option.label ?? undefined}
              value={option.value ?? undefined}
              onInput={onInteracted}
              onChange={handleChange}
            />
            <p
              className={cn(
                'typography-body-2',
                options.checkboxLabelClassName
              )}
            >
              {option.label}
            </p>
          </div>
        );
      })}
    </div>
  );
};
