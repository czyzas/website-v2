// TODO: Find a way to fetch homepage data without hardcoding WP ids
export const HOMEPAGE_IDS: Record<string, string> = {
  en: '6',
  fr: '506',
  de: '580',
};

export const IMAGE_WIDTHS = [375, 576, 768, 992, 1200, 1920];

export const HUBSPOT_FORM_ENDPOINT = 'https://api.hubapi.com/forms/v2/forms';

// TODO: HANDLE TRANSLATED STRING FROM WORDPRESS
export const TRANSLATIONS = {
  SOURCE: 'Source',
  FORM_MESSAGE_THANK_YOU: 'THANK YOU FOR SUBMISSION',
  SUBMIT: 'Submit',
  SUBMITTING: 'Submitting',
  PRIVACY_POLICY_TEXT: 'DEFAULT PRIVACY POLICY TEXT',
  FORM_SUBMISSION_FAILED_MESSAGE: 'SUBMISSION FAILED',
  TERMS_LINK_LABEL: 'TERMS LINK',
  PRIVCY_LINK_LABEL: 'PRIVACY LINK',
} as const;
