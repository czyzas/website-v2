import type { FC } from 'react';
import type { IFieldProps } from '@/components/hubspot-form/shared';
import { createStore } from '@/scripts/store';

const defaultValues = {
  checkbox: null,
  select: null,
  textarea: null,
  text: null,
  number: null,
  phonenumber: null,
};

export const hubspotHandlersStore = createStore<{
  [Key in keyof typeof defaultValues]: FC<IFieldProps> | null;
}>(defaultValues);
