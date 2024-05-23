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
  EVENT: 'EVENT',
  PAST_EVENT: 'PAST EVENT',
  READ_MORE: 'Read more',
  MORE_STORIES: 'More stories',
  READ_FULL_STORY: 'Read the full story',
  VIEW_CASE_STUDY: 'View Case Study',
  ALL: 'All',
  SIGN_UP: 'Sign up',
  NEWSLETTER_SECTION: {
    FORM_SUCCESS_MESSAGE: 'SUBMISSION SUCCESS',
  },
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
