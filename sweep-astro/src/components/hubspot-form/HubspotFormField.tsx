/* eslint-disable jsx-a11y/label-has-associated-control */
import { cn } from '@/scripts/cn';
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
  <div className={cn('flex gap-2', options.fieldContainerClassName)}>
    {options.showLabels !== false && field.label && !field.hidden && (
      <label
        className={options.labelClassName}
        htmlFor={makeInputId(formName, field.name)}
        // required={field.required}
      >
        <span dangerouslySetInnerHTML={{ __html: field.label }} />
      </label>
    )}
    {field.fieldType ? (
      <FieldFactory
        field={{ formName, field, value, onInteracted, onChange, options }}
        type={field.fieldType}
      />
    ) : null}
  </div>
);
