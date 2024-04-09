import type { ChangeEvent } from 'react';
import { useCallback, useState } from 'react';
import { HubspotDependentFields } from './HubspotDependentFields';
import type { IFieldProps } from './HubspotFormFieldFactory';
import { registerFieldTypeHandler } from './HubspotFormFieldFactory';
import { makeInputId } from './shared';

const HubspotSelectField: React.FC<IFieldProps> = ({
  formName,
  field,
  onInteracted,
  onChange,
  options,
}) => {
  const [currentValue, setCurrentValue] = useState<string>('');

  const handleChange = useCallback(
    (
      ev: ChangeEvent<HTMLSelectElement>
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

  return (
    <>
      <select
        className={options.fieldClassName}
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
      </select>
      {field.description ? (
        <span className="helper-text">{field.description}</span>
      ) : null}
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
