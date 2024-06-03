export const IMAGE_WIDTHS = [375, 576, 768, 992, 1200, 1920];

export const DEFAULT_POSTS_PER_PAGE = 9;

export const PAGINATION_PREFIX = 'page';

export const HUBSPOT_FORM_ENDPOINT = 'https://api.hubapi.com/forms/v2/forms';

// TODO: HANDLE TRANSLATED STRING FROM WORDPRESS
export const TRANSLATIONS = {
  SOURCE: 'Source',
  HEADER: {
    LOGIN: 'Login',
    BOOK_DEMO: 'Book a demo',
  },
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
  GATED_CONTENT: {
    TITLE: 'Just a moment...',
    SUB_TITLE:
      "We'd love to know a little more about you. Enter your details to unlock the page",
  },
  HOME: 'Home',
  EVENT: 'EVENT',
  BLOG: 'Blog',
  PAST_EVENT: 'PAST EVENT',
  READ_MORE: 'Read more',
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
  ARTICLE: {
    MORE_STORIES: 'More stories',
    MORE_EVENTS: 'More events',
  },
} as const;
