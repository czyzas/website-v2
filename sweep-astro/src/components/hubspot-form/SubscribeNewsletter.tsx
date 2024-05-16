import { useState } from 'react';
import { TRANSLATIONS } from '@/constants';
import { cn } from '@/scripts/cn';
import { Button } from '../ui/Button';
import { HubspotForm } from './HubspotForm';
import type { IHubspotFormDefinition } from './shared';

const SubscribeNewsletter = ({ form }: { form: IHubspotFormDefinition }) => {
  const [isSubmitSuccessful, setIsSubmitSuccessful] = useState(false);

  return (
    <div className="flex gap-3 h-full w-full">
      <div className="flex flex-col gap-2">
        {isSubmitSuccessful ? (
          <p>{TRANSLATIONS.NEWSLETTER_SECTION.FORM_SUCCESS_MESSAGE}</p>
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
            <Button form="newsletter-form" variant="secondary" type="submit">
              {TRANSLATIONS.SIGN_UP}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubscribeNewsletter;
