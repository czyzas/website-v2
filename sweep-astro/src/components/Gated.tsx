import type { ReactNode } from 'react';
import { Fragment, useEffect, useMemo, useState } from 'react';
import { useLocalStorageGlobalState } from '@/scripts/client/hooks/useLocalStorageState';
import { $gated } from '@/scripts/client/atoms/gated';
import { isBrowser } from '@/scripts/client/utils';
import { HubspotForm } from './hubspot-form/HubspotForm';
import type { IHubspotFormDefinition } from './hubspot-form/shared';

type GatedProps = {
  form: IHubspotFormDefinition;
  children: ReactNode;
  guid: string;
  formName?: string;
  title?: string;
  overline?: string;
};

const Gated = ({
  form,
  children,
  guid,
  formName,
  title = '',
  overline = '',
}: GatedProps) => {
  const [isGated, setGated] = useState(true);
  const [isClient, setIsClient] = useState(false);

  const [storedGated, setStoredGated, removeGateInLocalStorage] =
    useLocalStorageGlobalState({
      key: `${guid}-gate`,
      initialValue: Boolean(form),
    });

  useEffect(() => {
    setIsClient(true);
    setGated(storedGated);
    $gated.set(storedGated);
  }, []);

  const contentToShow = useMemo(() => {
    const isGoogle =
      isBrowser() && navigator?.userAgent.toLowerCase().includes('googlebot');

    if (isGoogle || !isGated) return children;
  }, [isGated, children, isClient]);

  useEffect(() => {
    if (isClient && isGated && !form) {
      removeGateInLocalStorage();
    }
  }, [isGated, form, isClient, removeGateInLocalStorage]);

  return (
    <Fragment>
      {isGated && form && (
        <div className="box-shadow relative">
          <div className="absolute bottom-full h-60 w-full bg-gradient-to-b from-white/20 to-white"></div>
          <p className="text-center font-medium text-sw-text-subdued">
            {overline}
          </p>
          <h2 className="typography-h2 pb-8 pt-4 text-center">{title}</h2>
          <HubspotForm
            form={form}
            formName={formName}
            onSuccess={() => {
              setStoredGated(false);
              setGated(false);
              $gated.set(false);
            }}
          />
        </div>
      )}
      {!isGated && contentToShow}
    </Fragment>
  );
};

export default Gated;
