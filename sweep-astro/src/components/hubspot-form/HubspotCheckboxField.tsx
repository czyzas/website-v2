import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Box } from '@mui/material';
import SwCheckbox from '../bedrock/form/SwCheckbox';
import SwTypography from '../bedrock/typography/SwTypography';
import type { IFieldProps } from './HubspotFormFieldFactory';
import { registerFieldTypeHandler } from './HubspotFormFieldFactory';
import type { IHubspotFormFormFieldOptionsDefinition } from './shared';
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

const HubspotCheckboxField: React.FC<IFieldProps> = ({
  formName,
  field,
  onInteracted,
  onChange,
  value,
  options,
}) => {
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
        const checked = currentValue.includes(value);

        return (
          <Box alignItems={'center'} display={'flex'} gap={1} key={value}>
            <SwCheckbox
              backgroundColor={'white'}
              checked={checked}
              className={options.checkboxFieldClassName}
              id={makeInputId(formName, field.name)}
              inputProps={{
                'aria-label': option.label,
                onInput: onInteracted,
              }}
              value={option.value ?? undefined}
              onChange={handleChange}
            />
            <SwTypography
              className={options.checkboxLabelClassName}
              variant={'body2'}
            >
              {option.label}
            </SwTypography>
          </Box>
        );
      })}
    </div>
  );
};

export function registerCheckboxField(): void {
  registerFieldTypeHandler('checkbox', HubspotCheckboxField);
}
