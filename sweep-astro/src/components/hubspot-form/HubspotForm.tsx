// import { CheckCircle } from '@phosphor-icons/react';
import ReactHtmlParser from 'html-react-parser';
import type { ComponentProps, ReactNode } from 'react';
import { useCallback } from 'react';
import { cn } from '@/scripts/cn';
import { TRANSLATIONS } from '@/constants';
import { HubspotFormGroup } from './HubspotFormGroup';
import type {
  EventReporter,
  IHubspotFormDefinition,
  IHubspotFormOptions,
  IHubspotFormSubmitBody,
} from './shared';
import type { HubspotFormStatus } from './useFormHandler';
import { useFormHandler } from './useFormHandler';
import {
  registerCheckboxField,
  registerHubspotTextField,
  registerSelectField,
  registerTextAreaField,
} from './register';

function register(): void {
  registerHubspotTextField();
  registerTextAreaField();
  registerSelectField();
  registerCheckboxField();
}

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
  ipAddress?: string;
}

export const HubspotForm: React.FC<HubSpotFormProps> = ({
  form: formDefinition,
  values,
  options = {},
  onSubmitForm,
  reportEvent,
  onSuccess,
  pageName,
  ipAddress,
  submitRender,
  formAnchor,
  ...formProps
}) => {
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
      if (onSuccess) {
        submitForm(e.currentTarget, { onSuccess });
      } else {
        console.error('onSuccess function does not exist');
      }
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
              TRANSLATIONS.FORM_MESSAGE_THANK_YOU}
          </div>
        )}
      </div>
    );
  }

  const name =
    formAnchor ??
    (formDefinition.name ?? formDefinition.id).replace(/\s+/g, '');

  const submitText =
    formDefinition.submitText ??
    options.defaultSubmitText ??
    TRANSLATIONS.SUBMIT;

  let privacyPolicyText: string = TRANSLATIONS.PRIVACY_POLICY_TEXT;
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

  if (!formRef) return null;

  return (
    <form
      className={cn(
        'flex flex-col items-start justify-start gap-4',
        options.formClassName
      )}
      id={name}
      method="POST"
      ref={(r) => {
        if (r) {
          formRef.current = r;
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
        <div className="submit-button-container flex flex-col items-start justify-start gap-3 w-full">
          <div className="typography-body-2 text-sw-text-subdued">
            {privacyPolicyText ? (
              ReactHtmlParser(privacyPolicyText)
            ) : (
              <>
                <a href="/terms">{TRANSLATIONS.TERMS_LINK_LABEL}</a>
                <a href="/privacy">{TRANSLATIONS.PRIVCY_LINK_LABEL}</a>
              </>
            )}
          </div>
          <div className="flex w-full">
            {submitRender ? (
              submitRender({ isLoading, status })
            ) : (
              <>
                {/* TODO: Use Astro button here somehow */}
                <button
                  className={options.submitClassName}
                  id={`Submit ${name}`}
                  // kind={SwButtonKind.Primary}
                  // loading={isLoading}
                  type={'submit'}
                >
                  {options.renderSubmitButton
                    ? options.renderSubmitButton(submitText)
                    : submitText}
                </button>
              </>
            )}
          </div>
        </div>
      )}
      {status === 'Failed' && (
        <>
          {/* TODO: HANDLE ERROR */}
          <div className="flash">
            <a href={'mailto:support@sweep.net'} className="typography-body-2">
              {TRANSLATIONS.FORM_SUBMISSION_FAILED_MESSAGE}
            </a>
          </div>
        </>
      )}
    </form>
  );
};

register();
