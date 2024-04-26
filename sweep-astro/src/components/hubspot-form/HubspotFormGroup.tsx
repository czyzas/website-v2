import type React from 'react';
import { cn } from '@/scripts/cn';
import { HubspotFormField } from './HubspotFormField';
import type { IHubspotFormFieldGroup, IHubspotFormOptions } from './shared';

const columns: Record<number, string> = {
  1: cn('md:grid-cols-1'),
  2: cn('md:grid-cols-2'),
  3: cn('md:grid-cols-3'),
  4: cn('md:grid-cols-4'),
  5: cn('md:grid-cols-5'),
  6: cn('md:grid-cols-6'),
  7: cn('md:grid-cols-7'),
  8: cn('md:grid-cols-8'),
  9: cn('md:grid-cols-9'),
  10: cn('md:grid-cols-10'),
  11: cn('md:grid-cols-11'),
  12: cn('md:grid-cols-12'),
};

interface IFormGroupProps {
  formName: string;
  group: IHubspotFormFieldGroup;
  options: IHubspotFormOptions;
  values?: Record<string, string | number | undefined>;
  onInteracted: () => void;
  onChange?: (ev: React.ChangeEvent<HTMLElement>) => void;
}

export const HubspotFormGroup = ({
  formName,
  group,
  options,
  values,
  onInteracted,
  onChange,
}: IFormGroupProps) => {
  const allHiddenFields = group.every((f) => f.hidden);
  return (
    <div
      className={cn(
        'form-group w-full grid grid-cols-1 gap-3.5',
        columns?.[group.length] ?? 'md:grid-cols-1',
        { hidden: allHiddenFields },
        allHiddenFields
          ? options.hiddenFieldGroupClassName
          : options.fieldGroupClassName
      )}
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
    </div>
  );
};
