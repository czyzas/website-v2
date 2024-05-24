import type { ReactNode } from 'react';
import { Fragment, useEffect, useMemo, useState } from 'react';
import { useLocalStorageGlobalState } from '@/lib/useLocalStorageState';
import { HubspotForm } from './hubspot-form/HubspotForm';
import type { IHubspotFormDefinition } from './hubspot-form/shared';
import Section from './ui/Section.astro';

type UseGatedContentArgs = {
  id: string;
  form: IHubspotFormDefinition;
  children: ReactNode;
};

const UseGatedContent = ({ id, form, children }: UseGatedContentArgs) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const [isGated, setGated, removeGateInLocalStorage] =
    useLocalStorageGlobalState({
      key: `${id}-gate`,
      initialValue: Boolean(form),
    });

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
          <p className="text-center text-sw-text-subdued font-medium">
            We’d love to know a little more about you. Enter your details to
            unlock the page
          </p>
          <h2 className="pt-4 pb-8 typography-h2 text-center">
            Just a moment...
          </h2>
          <HubspotForm form={form} onSuccess={() => setGated(false)} />
        </div>
      )}
      {!isGated && contentToShow}
    </Fragment>
  );
};

export default UseGatedContent;
