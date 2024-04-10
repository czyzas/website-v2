import { getStore } from '@/scripts/store';
import { hubspotHandlersStore } from '@/stores/hubspotHandlersStore';
import type { IFieldProps } from './shared';

export const FieldFactory: React.FC<{ type: string; field: IFieldProps }> = ({
  type,
  field,
}) => {
  const store = getStore(hubspotHandlersStore);
  const Component = store[type];

  if (!Component) {
    return null;
  }

  return <Component {...field} />;
};
