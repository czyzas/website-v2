import { CheckCircle } from '@phosphor-icons/react';
import Parser from 'html-react-parser';
import type { ComponentProps, ReactNode } from 'react';
import React, { useCallback } from 'react';
import { Trans } from 'react-i18next';
import { Box, Stack, styled } from '@mui/material';
import { t } from 'i18next';
import { WEBSITE_MENU_ITEM } from '@lib/constants/routing';
import { algaeGreenStrong } from '../bedrock/SwColors';
import SwFlash, { SwFlashKind } from '../bedrock/banner/SwFlash';
import SwButton, { SwButtonKind } from '../bedrock/button/SwButton';
import { colors } from '../bedrock/fundations';
import SwLine from '../bedrock/layout/SwLine';
import SwLink from '../bedrock/typography/SwLink';
import SwTypography from '../bedrock/typography/SwTypography';
import { registerCheckboxField } from './HubspotCheckboxField';
import { HubspotFormGroup } from './HubspotFormGroup';
import { registerSelectField } from './HubspotSelectField';
import { registerHubspotTextField } from './HubspotTextField';
import { registerTextAreaField } from './HubspotTextareaField';
import type {
  EventReporter,
  IHubspotFormDefinition,
  IHubspotFormOptions,
  IHubspotFormSubmitBody,
} from './shared';
import type { HubspotFormStatus } from './useFormHandler';
import { useFormHandler } from './useFormHandler';

function register(): void {
  registerHubspotTextField();
  registerTextAreaField();
  registerSelectField();
  registerCheckboxField();
}

const StyledA = styled('a')`
  color: black;
  &:hover {
    cursor: pointer;
  }
`;

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

export const HubspotForm: React.FC<HubSpotFormProps> = (props) => {
  const {
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
  } = props;
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
      submitForm(e.currentTarget, { onSuccess });
    },
    [submitForm, onSuccess]
  );
  if (!formDefinition) {
    console.error('Form does not exist');

    return null;
  }
  if (!formDefinition.portalId ?? !formDefinition.guid) {
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
      <Stack direction={'row'} id={'success-response'} spacing={1}>
        <CheckCircle color={algaeGreenStrong} size={24} weight={'fill'} />
        {formDefinition.inlineMessage ? (
          <SwTypography
            component={'div'}
            dangerouslySetInnerHTML={{ __html: formDefinition.inlineMessage }}
          />
        ) : (
          <SwTypography component={'div'}>
            {options.defaultSuccessMessage ||
              t('get_int_touch_page.form_message_thank_you')}
          </SwTypography>
        )}
      </Stack>
    );
  }

  const name =
    formAnchor ??
    (formDefinition.name ?? formDefinition.id).replace(/\s+/g, '');
  const submitText =
    formDefinition.submitText ?? options.defaultSubmitText ?? t('submit');

  const legalConsentOptions =
    formDefinition.metaData?.find(
      ({ name }) => name === 'legalConsentOptions'
    ) || null;
  const privacyPolicyText = JSON.parse(
    legalConsentOptions.value
  )?.privacyPolicyText;

  return (
    <Box
      alignItems={'start'}
      className={options.formClassName}
      component={'form'}
      display={'flex'}
      flexDirection={'column'}
      gap={2}
      id={name}
      justifyContent={'start'}
      method={'POST'}
      ref={formRef as any}
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
        <Stack
          alignItems={'start'}
          gap={3}
          justifyContent={'start'}
          width={'100%'}
        >
          <SwTypography color={colors.text.secondary} variant={'body2'}>
            {privacyPolicyText ? (
              Parser(privacyPolicyText)
            ) : (
              <Trans i18nKey={'form_terms'}>
                <SwLink
                  color={colors.text.secondary}
                  href={WEBSITE_MENU_ITEM.terms.link}
                  variant={'body2'}
                />
                <SwLink
                  color={colors.text.secondary}
                  href={WEBSITE_MENU_ITEM.privacy.link}
                  variant={'body2'}
                />
              </Trans>
            )}
          </SwTypography>
          <SwLine color={colors.border} direction={'horizontal'} spacing={0} />
          <Box display={'flex'} justifyContent={'end'} width={'100%'}>
            {submitRender ? (
              submitRender({ isLoading, status })
            ) : (
              <SwButton
                className={options.submitClassName}
                id={`Submit ${name}`}
                kind={SwButtonKind.Primary}
                loading={isLoading}
                type={'submit'}
              >
                {options.renderSubmitButton
                  ? options.renderSubmitButton(submitText)
                  : submitText}
              </SwButton>
            )}
          </Box>
        </Stack>
      )}
      {status === 'Failed' && (
        <SwFlash displayIcon={false} kind={SwFlashKind.Danger}>
          <SwTypography variant={'body2'}>
            <Trans i18nKey={'form_submission_failed_message'}>
              <StyledA href={'mailto:support@sweep.net'} />
            </Trans>
          </SwTypography>
        </SwFlash>
      )}
    </Box>
  );
};

register();
