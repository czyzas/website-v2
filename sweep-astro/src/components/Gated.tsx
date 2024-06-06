import type { ReactNode } from 'react';
import { Fragment, useEffect, useMemo, useState } from 'react';
import { TRANSLATIONS } from '@/constants';
import { useLocalStorageGlobalState } from '@/scripts/client/hooks/useLocalStorageState';
import { $gated } from '@/scripts/client/atoms/gated';
import { HubspotForm } from './hubspot-form/HubspotForm';
import type { IHubspotFormDefinition } from './hubspot-form/shared';

type GatedProps = {
  form: IHubspotFormDefinition;
  children: ReactNode;
  guid: string;
};

const Gated = ({ form, children, guid }: GatedProps) => {
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
      isClient && navigator?.userAgent.toLowerCase().includes('googlebot');

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
            {TRANSLATIONS.GATED_CONTENT.SUB_TITLE}
          </p>
          <h2 className="typography-h2 pb-8 pt-4 text-center">
            {TRANSLATIONS.GATED_CONTENT.TITLE}
          </h2>
          <HubspotForm
            form={form}
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
