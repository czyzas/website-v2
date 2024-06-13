import { useState } from 'react';
import { cn } from '@/scripts/cn';
import { isBrowser } from '@/scripts/client/utils';
import { getTranslations } from '@/scripts/translations';
import { Button } from '../../ui/Button';
import { HubspotForm } from '../HubspotForm';
import type { IHubspotFormDefinition } from '../shared';

const NewsletterForm = ({ form }: { form: IHubspotFormDefinition }) => {
  const [isSubmitSuccessful, setIsSubmitSuccessful] = useState(false);
  const TRANSLATIONS = isBrowser() ? window.TRANSLATIONS : getTranslations();

  return (
    <div className="flex h-full w-full gap-3">
      <div className="flex flex-col gap-2">
        {isSubmitSuccessful ? (
          <p>{TRANSLATIONS.newsletterSection.formSuccessMessage}</p>
        ) : (
          <div className="flex items-center gap-3">
            <HubspotForm
              form={form}
              id="newsletter-form"
              options={{
                hideSubmitButton: true,
                showLabels: false,
                fieldClassName: cn('p-2'),
              }}
              onSuccess={() => setIsSubmitSuccessful(true)}
            />
            <Button form="newsletter-form" variant="destructive" type="submit">
              {TRANSLATIONS.newsletterSection.signUp}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsletterForm;
