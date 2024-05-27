import type { ReactNode } from 'react';
import { Fragment, useEffect, useMemo, useState } from 'react';
import { useLocalStorageGlobalState } from '@/lib/useLocalStorageState';
import { TRANSLATIONS } from '@/constants';
import { HubspotForm } from './hubspot-form/HubspotForm';
import type { IHubspotFormDefinition } from './hubspot-form/shared';

type UseGatedContentArgs = {
  form: IHubspotFormDefinition;
  children: ReactNode;
  guid?: string;
};

const UseGatedContent = ({ form, children, guid }: UseGatedContentArgs) => {
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
  }, []);

  const contentToShow = useMemo(() => {
    // TODO check if google bot working
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
          <p className="text-center text-sw-text-subdued font-medium">
            {TRANSLATIONS.GATED_CONTENT.SUB_TITLE}
          </p>
          <h2 className="pt-4 pb-8 typography-h2 text-center">
            {TRANSLATIONS.GATED_CONTENT.TITLE}
          </h2>
          <HubspotForm
            form={form}
            onSuccess={() => {
              setStoredGated(false);
              setGated(false);
            }}
          />
        </div>
      )}
      {!isGated && contentToShow}
    </Fragment>
  );
};

export default UseGatedContent;
