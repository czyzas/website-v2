export const IMAGE_WIDTHS = [375, 576, 768, 992, 1200, 1920];

export const HUBSPOT_FORM_ENDPOINT = 'https://api.hubapi.com/forms/v2/forms';

// TODO: HANDLE TRANSLATED STRING FROM WORDPRESS
export const TRANSLATIONS = {
  SOURCE: 'Source',
  HUBSPOT_FORM: {
    SUBMIT: 'Submit',
    SUBMITTING: 'Submitting',
    FORM_MESSAGE_THANK_YOU: 'THANK YOU FOR SUBMISSION',
    PRIVACY_POLICY_TEXT: 'DEFAULT PRIVACY POLICY TEXT',
    FORM_SUBMISSION_FAILED_MESSAGE: 'SUBMISSION FAILED',
    TERMS_LINK_LABEL: 'TERMS LINK',
    PRIVCY_LINK_LABEL: 'PRIVACY LINK',
  },
  NEWSLETTER_SECTION: {
    FORM_SUCCESS_MESSAGE: 'SUBMISSION SUCCESS',
    SIGN_UP: 'Sign up',
  },
  HOME: 'Home',
  EVENT: 'EVENT',
  PAST_EVENT: 'PAST EVENT',
  READ_MORE: 'Read more',
  MORE_STORIES: 'More stories',
  READ_FULL_STORY: 'Read the full story',
  VIEW_CASE_STUDY: 'View Case Study',
  ALL: 'All',
  SIDEBAR: {
    AUTHOR: 'Author',
    TOC: 'Contents',
    JOIN_US_LIVE: 'Join us live in {location}',
  },
  EVENT_INFORMATION: {
    location: 'Location',
    date: 'Date',
    time: 'Time',
    language: 'Language',
  },
} as const;
