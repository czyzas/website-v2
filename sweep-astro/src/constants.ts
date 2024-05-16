export const IMAGE_WIDTHS = [375, 576, 768, 992, 1200, 1920];

export const HUBSPOT_FORM_ENDPOINT = 'https://api.hubapi.com/forms/v2/forms';

// TODO: HANDLE TRANSLATED STRING FROM WORDPRESS
export const TRANSLATIONS = {
  SOURCE: 'Source',
  FORM_MESSAGE_THANK_YOU: 'THANK YOU FOR SUBMISSION',
  SUBMIT: 'Submit',
  SUBMITTING: 'Submitting',
  HOME: 'Home',
  PRIVACY_POLICY_TEXT: 'DEFAULT PRIVACY POLICY TEXT',
  FORM_SUBMISSION_FAILED_MESSAGE: 'SUBMISSION FAILED',
  TERMS_LINK_LABEL: 'TERMS LINK',
  PRIVCY_LINK_LABEL: 'PRIVACY LINK',
  PAST_EVENT: 'PAST EVENT',
  READ_MORE: 'Read more',
  READ_FULL_STORY: 'Read the full story',
  ALL: 'All',
  SIGN_UP: 'Sign up',
  NEWSLETTER_SECTION: {
    FORM_SUCCESS_MESSAGE: 'SUBMISSION SUCCESS',
  },
} as const;
