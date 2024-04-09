import { useRef, useState, useMemo, useCallback, useEffect } from 'react';
import type {
  IHubspotFormDefinition,
  EventReporter,
  IHubspotFormSubmitBody,
  IHubspotFormFieldGroup,
  IHubspotFormFieldDefinition,
  IHubspotFormFieldGroupsDefinition,
  IDynamicFormState,
} from './shared';

export type HubspotFormStatus = 'Idle' | 'Success' | 'Failed' | 'Submitting';

interface IHubspotFormResponse {
  message: string;
  status: string;
  errors: ReadonlyArray<{ message: string }>;
}

function getCookieValue(name: string): string | undefined {
  return (
    document.cookie.match(`(^|;)\\s*${name}\\s*=\\s*([^;]+)`)?.pop() ??
    undefined
  );
}

export function useFormHandler(
  formDefinition: IHubspotFormDefinition,
  handleFormData?: (formData: FormData) => void,
  reportEvent?: EventReporter,
  pageName?: string,
  ipAddress?: string
) {
  const formRef = useRef<HTMLFormElement>();
  const formState = useRef<IDynamicFormState>({ isDirty: false });
  const [status, setStatus] = useState<HubspotFormStatus>('Idle');
  const [formResponse, setFormResponse] = useState<IHubspotFormResponse>();

  const { allGroups, fieldMapping } = useMemo(
    () => buildHubspotFormInformation(formDefinition),
    [formDefinition]
  );

  const isLoading = status === 'Submitting';

  const handleFinished = useCallback(() => {
    const { isDirty, form } = formState.current;

    if (form && formDefinition && isDirty) {
      handleFormAbandoned(form, formDefinition);
    }
  }, [formDefinition]);

  const handleFormInteracted = useCallback(() => {
    formState.current.isDirty = true;
    setStatus('Idle');
  }, []);

  const submitForm = useCallback(
    (
      form: HTMLFormElement,
      callbacks?: { onSuccess: (body: IHubspotFormSubmitBody) => void }
    ) => {
      if (formDefinition.portalId && formDefinition.guid) {
        reportEvent?.('hubspot_form_submit', {
          formId: formDefinition.id,
          formName: formDefinition.name?.trim(),
        });
        const formData = new FormData(form);
        handleFormData?.(formData);
        const fields: Array<{
          objectTypeId: string | undefined;
          name: string;
          value: string;
        }> = [];
        const request = {
          fields,
          context: {
            pageName,
            pageUri: window.location.pathname,
            hutk: getCookieValue('hubspotutk'),
            ipAddress,
          },
        };
        formData.forEach((v, k) => {
          const field = fieldMapping[k];
          if (field) {
            fields.push({
              objectTypeId: field.objectTypeId ?? undefined,
              name: k,
              value: Array.isArray(v) ? v.join(';') : v.toString(),
            });
          }
        });

        formState.current.isDirty = false;
        const url = `https://api.hsforms.com/submissions/v3/integration/submit/${formDefinition.portalId}/${formDefinition.guid}`;
        const payload = JSON.stringify(request);

        setStatus('Submitting');
        fetch(url, {
          method: 'POST',
          body: payload,
          headers: { 'Content-Type': 'application/json' },
        })
          .then((response) => {
            if (response.ok) {
              setFormResponse(undefined);
              reportEvent?.('hubspot_form_success', {
                formId: formDefinition.id,
                formName: formDefinition.name?.trim(),
              });

              setStatus(formState.current.isDirty ? 'Idle' : 'Success');
              const element = document.getElementById('success-response');

              if (element) {
                element.scrollIntoView();
              }
              callbacks?.onSuccess?.(request);
            } else {
              console.log('error:', response);
              response
                .json()
                .then((t: IHubspotFormResponse) => {
                  reportEvent?.('hubspot_form_failure', {
                    formName: formDefinition.name?.trim(),
                    formId: formDefinition.id,
                    formResponse: t,
                  });
                  setFormResponse(t);
                })
                .catch((error) => {
                  console.error('getting response error:', error);
                  reportEvent?.('hubspot_form_failure', {
                    formId: formDefinition.id,
                    formName: formDefinition.name?.trim(),
                  });
                })
                .finally(() => {
                  setStatus('Failed');
                });
            }
          })
          .catch((error) => {
            console.error('Failed', error);
            reportEvent?.('hubspot_form_error', {
              formId: formDefinition.id,
              formName: formDefinition.name?.trim(),
            });
            setStatus('Failed');
          });
      }
    },
    [
      formDefinition.portalId,
      formDefinition.guid,
      formDefinition.id,
      formDefinition.name,
      reportEvent,
      handleFormData,
      pageName,
      ipAddress,
      fieldMapping,
    ]
  );

  useEffect(() => handleFinished, [handleFinished]);

  useEffect(() => {
    if (formRef.current && formDefinition) {
      formState.current.form = formRef.current;
      reportEvent?.('hubspot_form_view', {
        formId: formDefinition.id,
        formName: formDefinition.name?.trim(),
      });
    }
  }, [formDefinition, formRef, reportEvent]);

  return {
    submitForm,
    allGroups,
    status,
    formResponse,
    isLoading,
    formRef,
    handleFormInteracted,
  };
}

function handleFormAbandoned(
  form: HTMLFormElement,
  formDefinition: IHubspotFormDefinition,
  reportEvent?: EventReporter
): void {
  const data = new FormData(form);
  const nonEmptyFields: Array<string> = [];
  data.forEach((value, key) => {
    if (value.toString()) {
      nonEmptyFields.push(key);
    }
  });
  reportEvent?.('hubspot_form_abandoned', {
    formId: formDefinition.id,
    formName: formDefinition.name?.trim(),
    formNonEmptyFields: nonEmptyFields.length ? nonEmptyFields : undefined,
  });
}

function buildHubspotFormInformation(formDefinition?: IHubspotFormDefinition): {
  allGroups: ReadonlyArray<IHubspotFormFieldGroup>;
  fieldMapping: Record<string, IHubspotFormFieldDefinition>;
} {
  const fieldMapping: Record<string, IHubspotFormFieldDefinition> = {};
  const allGroups: Array<IHubspotFormFieldGroup> = [];
  if (formDefinition) {
    (
      formDefinition.formFieldGroups?.filter(
        (ffg) => ffg && ffg.default
      ) as ReadonlyArray<IHubspotFormFieldGroupsDefinition>
    ).forEach((ffg) => {
      const groupFields: Array<IHubspotFormFieldDefinition> = [];
      ffg.fields?.forEach((field) => {
        if (field?.name) {
          groupFields.push(field);
          fieldMapping[field.name] = field;
        }
        if (field?.dependentFieldFilters) {
          field.dependentFieldFilters.forEach((dff) => {
            if (dff?.dependentFormField?.name) {
              fieldMapping[dff.dependentFormField.name] =
                dff.dependentFormField;
            }
          });
        }
      });
      if (groupFields.length > 0) {
        allGroups.push(groupFields);
      }
    });
  }

  return { allGroups, fieldMapping };
}
