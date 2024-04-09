import React from 'react';
import { HubspotDependentField } from './HubspotDependentField';
import type {
  IHubspotFormFormDependentFieldDefinition,
  IHubspotFormOptions,
} from './shared';

export const HubspotDependentFields: React.FC<{
  formName: string;
  fields: ReadonlyArray<IHubspotFormFormDependentFieldDefinition | null>;
  parentValue?: string;
  options: IHubspotFormOptions;
  onInteracted: () => void;
}> = ({ formName, fields, parentValue, options, onInteracted }) => (
  <>
    {(
      fields.filter(
        (field) => field?.dependentFormField?.enabled
      ) as ReadonlyArray<IHubspotFormFormDependentFieldDefinition>
    ).map((field) => (
      <HubspotDependentField
        field={field}
        formName={formName}
        key={field.dependentFormField?.label}
        options={options}
        parentValue={parentValue}
        onInteracted={onInteracted}
      />
    ))}
  </>
);
