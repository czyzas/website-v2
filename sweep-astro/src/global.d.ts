import type { Translations } from './scripts/translations';

declare global {
  interface Window {
    TRANSLATIONS: Translations;
  }
}
