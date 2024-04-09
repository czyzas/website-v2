import type React from 'react';
import { SwGrid } from '../bedrock/layout/SwGrid';
import { HubspotFormField } from './HubspotFormField';
import type { IHubspotFormFieldGroup, IHubspotFormOptions } from './shared';

export const HubspotFormGroup: React.FC<{
  formName: string;
  group: IHubspotFormFieldGroup;
  options: IHubspotFormOptions;
  values?: Record<string, string | number | undefined>;
  onInteracted: () => void;
  onChange?: (ev: React.ChangeEvent<HTMLElement>) => void;
}> = ({ formName, group, options, values, onInteracted, onChange }) => {
  const allHiddenFields = group.every((f) => f.hidden);

  return (
    <SwGrid
      className={
        allHiddenFields
          ? options.hiddenFieldGroupClassName
          : options.fieldGroupClassName
      }
      columns={{ xs: 1, sm: group.length }}
      gap={16}
    >
      {group.map((field) => (
        <HubspotFormField
          field={field}
          formName={formName}
          key={field.name}
          options={options}
          value={values && field.name ? values[field.name] : ''}
          onChange={onChange}
          onInteracted={onInteracted}
        />
      ))}
    </SwGrid>
  );
};
