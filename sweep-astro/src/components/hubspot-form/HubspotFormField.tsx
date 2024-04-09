import React from 'react';
import { Stack } from '@mui/material';
import SwInputLabel from '../bedrock/form/SwInputLabel';
import { FieldFactory } from './HubspotFormFieldFactory';
import type {
  IHubspotFormFieldDefinition,
  IHubspotFormOptions,
} from './shared';
import { makeInputId } from './shared';

export const HubspotFormField: React.FC<{
  formName: string;
  field: IHubspotFormFieldDefinition;
  options: IHubspotFormOptions;
  value?: string | number | undefined;
  onInteracted: () => void;
  onChange?: (ev: React.ChangeEvent<HTMLElement>) => void;
}> = ({ formName, field, value, onInteracted, onChange, options }) => (
  <Stack className={options.fieldContainerClassName} gap={0.5}>
    {options.showLabels !== false && field.label && !field.hidden && (
      <SwInputLabel
        className={options.labelClassName}
        htmlFor={makeInputId(formName, field.name)}
        required={field.required}
      >
        <p dangerouslySetInnerHTML={{ __html: field.label }} />
      </SwInputLabel>
    )}
    <FieldFactory
      field={{ formName, field, value, onInteracted, onChange, options }}
      type={field.fieldType}
    />
  </Stack>
);
