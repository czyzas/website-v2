import { useMemo, useState } from 'react';
import { cn } from '@/scripts/cn';
import { isBrowser } from '@/scripts/client/utils';
import { getTranslations } from '@/scripts/translations';
import { Button } from '../../ui/Button';
import { HubspotForm } from '../HubspotForm';
import type { IHubspotFormDefinition } from '../shared';

const srdAttribution = {
  'finance-fr': {
    meeting: 'https://meetings.salesloft.com/sweep/discovery-call-finance',
    countries: true,
    industries: [
      'Banks',
      'Finance',
      'Financials - Banks',
      'Financials - Diversified Financials',
      'Financials - Investment',
      'Financials - Payment solution',
      'Government banks',
      'Investment',
    ],
  },
  'corporate-fr': {
    meeting: 'https://meetings.salesloft.com/sweep/discovery-call',
    countries: [
      'Austria',
      'Belgium',
      'Bulgaria',
      'Croatia',
      'Republic of Cyprus',
      'Czech Republic',
      'Estonia',
      'France',
      'Germany',
      'Greece',
      'Hungary',
      'Italy',
      'Latvia',
      'Lithuania',
      'Luxembourg',
      'Malta',
      'Netherlands',
      'Poland',
      'Portugal',
      'Romania',
      'Slovakia',
      'Slovenia',
      'Spain',
    ],
    industries: true,
  },
  'corporate-uk': {
    meeting: 'https://meetings.salesloft.com/sweep/discovery-call-sdr-uk',
    industries: true,
    countries: true,
  },
  'partner-sales': {
    meeting: 'https://meetings.salesloft.com/sweep/jeromeblum',
  },
};

function getSalesLoftMeetings(
  country?: string,
  industry?: string,
  contactRequest?: string
) {
  if (
    contactRequest &&
    [
      'A solution on behalf of my client/prospect',
      'Becoming an official Sweep Partner',
      'Connecting my technology with Sweep',
    ].includes(contactRequest)
  ) {
    return srdAttribution['partner-sales'].meeting;
  }

  if (!country && !industry) {
    return srdAttribution['corporate-fr'].meeting;
  }

  if (industry && srdAttribution['finance-fr'].industries.includes(industry)) {
    return srdAttribution['finance-fr'].meeting;
  }

  if (country && srdAttribution['corporate-fr'].countries.includes(country)) {
    return srdAttribution['corporate-fr'].meeting;
  }

  return srdAttribution['corporate-uk'].meeting;
}

type ViewState = 'contactForm' | 'calendar' | 'successMessage';
type UserFlow = 'direct' | 'selectMeeting';

const NewsletterForm = ({ form }: { form: IHubspotFormDefinition }) => {
  const TRANSLATIONS = isBrowser() ? window.TRANSLATIONS : getTranslations();
  const [viewState, setViewState] = useState<ViewState>('contactForm');
  const [userFlow, setUserFlow] = useState<UserFlow>('direct');
  const [sdr, setSdr] = useState<{
    country?: string;
    industry?: string;
    contactRequest?: string;
  }>({});

  const meetingLink = useMemo<string | null>(
    () =>
      Object.keys(sdr).length
        ? getSalesLoftMeetings(sdr.country, sdr.industry, sdr.contactRequest)
        : null,
    [sdr]
  );

  return (
    <div className="flex flex-col gap-3">
      {viewState === 'contactForm' && (
        <HubspotForm
          form={form}
          id="newsletter-form"
          options={{ showSuccess: false }}
          submitRender={({ isLoading }) => (
            <div className="flex items-center gap-3">
              <Button type="submit" variant="secondary" loading={isLoading}>
                {form.submitText ?? TRANSLATIONS.hubspotForm.submit}
              </Button>
              <Button
                type="submit"
                arrow
                loading={isLoading}
                onClick={() => setUserFlow('selectMeeting')}
              >
                {TRANSLATIONS.hubspotForm.selectDateAndTime}
              </Button>
            </div>
          )}
          onSuccess={({ fields }) => {
            const country = fields.find(
              ({ name }) => name === 'country_sf'
            )?.value;
            const industry = fields.find(
              ({ name }) => name === 'industry_sf'
            )?.value;
            const contactRequest = fields.find(
              ({ name }) => name === 'git___type_of_contact_request'
            )?.value;

            setSdr({
              country,
              industry,
              contactRequest,
            });

            if (userFlow === 'selectMeeting') {
              setViewState('calendar');
            } else {
              setViewState('successMessage');
            }
          }}
        />
      )}
      {viewState === 'calendar' && meetingLink && (
        <div className="flex flex-col gap-4">
          <iframe
            title="demo-meeting-form"
            height="960px"
            width="100%"
            src={meetingLink}
            className={cn('h-[60rem] w-full border-none', {
              hidden: viewState !== 'calendar',
            })}
          />
          <Button
            variant="secondary"
            aria-label={TRANSLATIONS.hubspotForm.skipThisStep}
            onClick={() => setViewState('successMessage')}
          >
            {TRANSLATIONS.hubspotForm.skipThisStep}
          </Button>
        </div>
      )}
      {viewState === 'successMessage' && (
        <div
          dangerouslySetInnerHTML={{
            __html:
              form.inlineMessage ||
              TRANSLATIONS.hubspotForm.formMessageThankYou,
          }}
        />
      )}
    </div>
  );
};

export default NewsletterForm;
