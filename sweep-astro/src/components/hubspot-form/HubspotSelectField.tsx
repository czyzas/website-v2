import type { ChangeEvent } from 'react';
import { useCallback, useState } from 'react';
import { cn } from '@/scripts/cn';
import { makeInputId } from './shared';
import type { IFieldProps } from './shared';
import { HubspotDependentFields } from './HubspotDependentFields';
import { base } from './ui/styles';
import { Combobox } from './ui/Combobox/Combobox';

export const HubspotSelectField = ({
  formName,
  field,
  onInteracted,
  onChange,
  options,
}: IFieldProps) => {
  const [currentValue, setCurrentValue] = useState<string>('');

  const handleChange = useCallback(
    (
      ev: ChangeEvent<HTMLInputElement>
      // value: IHubspotFormFormFieldOptionsDefinition
    ) => {
      const { value } = ev.target;
      setCurrentValue(value);
      onInteracted();
      onChange?.(ev);
    },
    [onInteracted, onChange]
  );

  if (!field.name || !field.options) return null;

  const selectOptions = field.options
    .filter(
      (o): o is { value: string; label: string } => !!(o && o.value && o.label)
    )
    .map(({ value, label }) => ({ value, label }));

  return (
    <>
      <Combobox
        className={cn('select', base, options.fieldClassName)}
        disabled={!field.enabled}
        id={makeInputId(formName, field.name)}
        name={field.name}
        required={!!field.required}
        value={currentValue}
        onChange={handleChange}
        options={selectOptions}
      />
      {/* <select
        className={cn('select', base, options.fieldClassName)}
        disabled={!field.enabled}
        id={makeInputId(formName, field.name)}
        name={field.name}
        // placeholder={field.placeholder ?? ''}
        required={!!field.required}
        value={currentValue}
        onChange={handleChange}
      >
        {field.options?.map((option) =>
          option?.value && option?.label ? (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ) : null
        )}
      </select> */}
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
