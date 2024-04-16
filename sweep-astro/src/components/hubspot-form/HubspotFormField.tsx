import { cn } from '@/scripts/cn';
import { FieldFactory } from './HubspotFormFieldFactory';
import type {
  IHubspotFormFieldDefinition,
  IHubspotFormOptions,
} from './shared';
import { makeInputId } from './shared';

interface HubspotFormFieldProps {
  formName: string;
  field: IHubspotFormFieldDefinition;
  options: IHubspotFormOptions;
  value?: string | number | undefined;
  onInteracted: () => void;
  onChange?: (ev: React.ChangeEvent<HTMLElement>) => void;
}

export const HubspotFormField = ({
  formName,
  field,
  value,
  onInteracted,
  onChange,
  options,
}: HubspotFormFieldProps) => (
  <div
    className={cn(
      'form-field',
      'flex flex-col gap-1',
      options.fieldContainerClassName
    )}
  >
    {options.showLabels !== false && field.label && !field.hidden && (
      <label
        className={cn('sr-only', options.labelClassName)}
        htmlFor={makeInputId(formName, field.name)}
        // required={field.required}
      >
        <span dangerouslySetInnerHTML={{ __html: field.label }} />
        {field.required ? <span className="text-sw-fire-400">*</span> : null}
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
