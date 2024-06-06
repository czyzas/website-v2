// import { CheckCircle } from '@phosphor-icons/react';
import ReactHtmlParser from 'html-react-parser';
import type { ComponentProps, ReactNode } from 'react';
import { useCallback } from 'react';
import { cn } from '@/scripts/cn';
import { TRANSLATIONS } from '@/constants';
import { Button } from '../ui/Button';
import { HubspotFormGroup } from './HubspotFormGroup';
import type {
  EventReporter,
  IHubspotFormDefinition,
  IHubspotFormOptions,
  IHubspotFormSubmitBody,
} from './shared';
import type { HubspotFormStatus } from './useFormHandler';
import { useFormHandler } from './useFormHandler';
import { usePublicIp } from './ip';
import { HubspotPhoneField } from './HubspotPhoneField';
import { HubspotTextField } from './HubspotTextField';
import { HubspotSelectField } from './HubspotSelectField';
import { HubspotTextareaField } from './HubspotTextareaField';
import { HubspotCheckboxField } from './HubspotCheckboxField';
import { registerFieldTypeHandler } from './HubspotFormFieldFactory';

export interface HubSpotFormProps
  extends Omit<ComponentProps<'form'>, 'ref' | 'onSubmit'> {
  form: IHubspotFormDefinition;
  options?: IHubspotFormOptions;
  values?: Record<string, string | number | undefined>;
  onSubmitForm?: (formData: FormData) => void;
  reportEvent?: EventReporter;
  onSuccess?: (body: IHubspotFormSubmitBody) => void;
  pageName?: string;
  formAnchor?: string;
  submitRender?: ({
    isLoading,
    status,
  }: {
    isLoading: boolean;
    status: HubspotFormStatus;
  }) => ReactNode;
}

export const HubspotForm = ({
  form: formDefinition,
  values,
  options = {},
  onSubmitForm,
  reportEvent,
  onSuccess,
  pageName,
  submitRender,
  formAnchor,
  ...formProps
}: HubSpotFormProps) => {
  // TODO: handle user consent
  const ipAddress = usePublicIp();

  const {
    status,
    formResponse,
    submitForm,
    allGroups,
    formRef,
    handleFormInteracted,
    isLoading,
  } = useFormHandler(
    formDefinition,
    onSubmitForm,
    reportEvent,
    pageName,
    ipAddress
  );

  const onSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      submitForm(e.currentTarget, {
        onSuccess(body) {
          // TODO: reset form
          onSuccess?.(body);
        },
      });
    },
    [submitForm, onSuccess]
  );

  if (!formDefinition) {
    console.error('Form does not exist');

    return null;
  }
  if (!(formDefinition.portalId ?? formDefinition.guid)) {
    console.error('Invalid form configuration');

    return null;
  }

  if (options.showSuccess === false && status === 'Success') {
    if (formDefinition?.redirect) {
      const link = document.createElement('a');
      link.href = formDefinition.redirect;
      link.target = '_blank';
      link.rel = 'noreferrer';
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
    }

    return (
      <div className="flex gap-2" id={'success-response'}>
        {/* <CheckCircle color={algaeGreenStrong} size={24} weight={'fill'} /> */}
        {formDefinition.inlineMessage ? (
          <div
            dangerouslySetInnerHTML={{ __html: formDefinition.inlineMessage }}
          />
        ) : (
          <div>
            {options.defaultSuccessMessage ||
              TRANSLATIONS.HUBSPOT_FORM.FORM_MESSAGE_THANK_YOU}
          </div>
        )}
      </div>
    );
  }

  const name =
    formAnchor ??
    (formDefinition.name ?? formDefinition.id).replace(/\s+/g, '');

  const submitText =
    status === 'Submitting'
      ? TRANSLATIONS.HUBSPOT_FORM.SUBMITTING
      : formDefinition.submitText ??
        options.defaultSubmitText ??
        TRANSLATIONS.HUBSPOT_FORM.SUBMIT;

  let privacyPolicyText: string = TRANSLATIONS.HUBSPOT_FORM.PRIVACY_POLICY_TEXT;
  try {
    const legalConsentOptionsKV = formDefinition.metaData?.find(
      (meta) => meta?.name === 'legalConsentOptions'
    );

    if (legalConsentOptionsKV && legalConsentOptionsKV?.value) {
      const legalConsentOptions = JSON.parse(legalConsentOptionsKV.value) as {
        privacyPolicyText?: string;
      };

      if (legalConsentOptions.privacyPolicyText) {
        privacyPolicyText = legalConsentOptions.privacyPolicyText;
      }
    }
  } catch {}

  // TODO: reset form after submit
  return (
    <form
      className={cn(
        'form flex flex-col items-start justify-start gap-6',
        options.formClassName
      )}
      id={name}
      method="POST"
      ref={(el) => {
        if (el) {
          formRef.current = el;
        }
      }}
      onSubmit={onSubmit}
      {...formProps}
    >
      {formResponse && !options.showFormResponseOutside && (
        <div className={options.responseClassName}>
          <h3>{formResponse.message}</h3>
          {formResponse.errors.map((error) => (
            <p key={error.message}>{error.message}</p>
          ))}
        </div>
      )}
      {allGroups.map((group, index) => (
        <HubspotFormGroup
          formName={name}
          group={group}
          key={index}
          options={options}
          values={values}
          onInteracted={handleFormInteracted}
        />
      ))}
      {!options.hideSubmitButton && (
        <div className="submit-button-container flex w-full flex-col items-start justify-start gap-3">
          <div className="typography-body-2 text-sw-text-subdued [&>a:focus]:text-sw-sky-400 [&>a:hover]:text-sw-sky-400 [&>a]:underline">
            {privacyPolicyText ? (
              ReactHtmlParser(privacyPolicyText)
            ) : (
              <>
                {/* TODO: Handle links and labels */}
                <a href="/terms">
                  {TRANSLATIONS.HUBSPOT_FORM.TERMS_LINK_LABEL}
                </a>
                <a href="/privacy">
                  {TRANSLATIONS.HUBSPOT_FORM.PRIVCY_LINK_LABEL}
                </a>
              </>
            )}
          </div>
          <div className="flex w-full">
            {submitRender ? (
              submitRender({ isLoading, status })
            ) : (
              <>
                <Button
                  type="submit"
                  className={options.submitClassName}
                  id={`Submit ${name}`}
                  variant="secondary"
                >
                  {options.renderSubmitButton
                    ? options.renderSubmitButton(submitText)
                    : submitText}
                </Button>
              </>
            )}
          </div>
        </div>
      )}
      {status === 'Failed' && (
        <>
          {/* TODO: HANDLE ERROR */}
          <div className="flash">
            <p>{TRANSLATIONS.HUBSPOT_FORM.FORM_SUBMISSION_FAILED_MESSAGE}</p>
          </div>
        </>
      )}
    </form>
  );
};

function register(): void {
  registerFieldTypeHandler('text', HubspotTextField);
  registerFieldTypeHandler('textarea', HubspotTextareaField);
  registerFieldTypeHandler('number', HubspotTextField);
  registerFieldTypeHandler('phonenumber', HubspotPhoneField);
  registerFieldTypeHandler('select', HubspotSelectField);
  registerFieldTypeHandler('checkbox', HubspotCheckboxField);
}

register();
