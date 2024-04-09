import type { ChangeEvent } from 'react';
import React, { useCallback, useState } from 'react';
import SwAutocomplete from '../../../components/v1/Inputs/SwAutocomplete';
import { HubspotDependentFields } from './HubspotDependentFields';
import type { IFieldProps } from './HubspotFormFieldFactory';
import { registerFieldTypeHandler } from './HubspotFormFieldFactory';
import type { IHubspotFormFormFieldOptionsDefinition } from './shared';
import { makeInputId } from './shared';

const HubspotSelectField: React.FC<IFieldProps> = ({
  formName,
  field,
  onInteracted,
  onChange,
  options,
}) => {
  const [currentValue, setCurrentValue] =
    useState<IHubspotFormFormFieldOptionsDefinition>();

  const handleChange = useCallback(
    (
      ev: ChangeEvent<HTMLSelectElement>,
      value: IHubspotFormFormFieldOptionsDefinition
    ) => {
      setCurrentValue(value);
      onInteracted();
      onChange?.(ev);
    },
    [onInteracted, onChange]
  );

  return (
    <>
      <SwAutocomplete
        className={options.fieldClassName}
        disabled={!field.enabled}
        fullWidth={true}
        getOptionLabel={(option: IHubspotFormFormFieldOptionsDefinition) =>
          option.label
        }
        helperText={field.description}
        id={makeInputId(formName, field.name)}
        name={field.name}
        options={field.options}
        placeholder={field.placeholder}
        required={field.required}
        value={currentValue}
        onChange={handleChange}
      />
      {field.__typename === 'HubspotFormFormFieldGroupsFields' &&
        field.dependentFieldFilters && (
          <HubspotDependentFields
            fields={field.dependentFieldFilters}
            formName={formName}
            options={options}
            parentValue={currentValue as string}
            onInteracted={onInteracted}
          />
        )}
    </>
  );
};

export function registerSelectField(): void {
  registerFieldTypeHandler('select', HubspotSelectField);
}
