import React from 'react';
import type {
  IHubspotFormFieldDefinition,
  IHubspotFormOptions,
} from './shared';

export interface IFieldProps {
  formName: string;
  field: IHubspotFormFieldDefinition;
  value?: string | number;
  onInteracted: () => void;
  onChange?: (ev: React.ChangeEvent<HTMLElement>) => void;
  options: IHubspotFormOptions;
}

const handlers: Record<string, React.FC<IFieldProps>> = {};

export function registerFieldTypeHandler(
  type: string,
  component: React.FC<IFieldProps>
): void {
  handlers[type] = component;
}

export const FieldFactory: React.FC<{ type: string; field: IFieldProps }> = ({
  type,
  field,
}) => {
  const Component = handlers[type];

  if (!Component) {
    return null;
  }

  return <Component {...field} />;
};
