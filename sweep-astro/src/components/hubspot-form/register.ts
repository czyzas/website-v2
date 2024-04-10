import { updateStore } from '@/scripts/store';
import { hubspotHandlersStore } from '@/stores/hubspotHandlersStore';
import { HubspotCheckboxField } from './HubspotCheckboxField';
import { HubspotSelectField } from './HubspotSelectField';
import { HubspotTextareaField } from './HubspotTextareaField';
import { HubspotPhoneField } from './HubspotPhoneField';
import { HubspotTextField } from './HubspotTextField';

export function registerCheckboxField(): void {
  updateStore(hubspotHandlersStore, 'checkbox', HubspotCheckboxField);
}

export function registerSelectField(): void {
  updateStore(hubspotHandlersStore, 'select', HubspotSelectField);
}

export function registerTextAreaField(): void {
  updateStore(hubspotHandlersStore, 'textarea', HubspotTextareaField);
}

export function registerHubspotTextField(): void {
  updateStore(hubspotHandlersStore, 'text', HubspotTextField);
  updateStore(hubspotHandlersStore, 'number', HubspotTextField);
  updateStore(hubspotHandlersStore, 'phonenumber', HubspotPhoneField);
}
