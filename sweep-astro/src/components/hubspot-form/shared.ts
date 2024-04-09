import type React from 'react';

export interface IHubspotFormOptions {
  showSuccess?: boolean;
  radioContainerClassName?: string;
  radioLabelClassName?: string;
  radioFieldClassName?: string;
  checkboxContainerClassName?: string;
  checkboxLabelClassName?: string;
  checkboxFieldClassName?: string;
  fieldGroupClassName?: string;
  hiddenFieldGroupClassName?: string;
  fieldContainerClassName?: string;
  labelClassName?: string;
  requiredClassName?: string;
  requiredText?: string;
  selectText?: string;
  fieldClassName?: string;
  textAreaRows?: number;
  showLabels?: boolean;
  submitButton?: boolean;
  successClassName?: string;
  failureClassName?: string;
  defaultSuccessMessage?: string;
  defaultFailureMessage?: string;
  showFormResponseOutside?: boolean;
  responseClassName?: string;
  formClassName?: string;
  submitClassName?: string;
  defaultSubmitText?: string;
  hideSubmitButton?: boolean;
  renderSubmitButton?: (text: string) => React.ReactElement;
  showError?: (message: string) => React.ReactElement;
  renderCheckbox?: (value: string, label?: string | null) => React.ReactElement;
}

export type EventReporter = (
  eventName: string,
  eventData: Record<string, unknown>
) => void;

export interface IHubspotFormDefinition {
  readonly __typename?: 'HubspotForm';
  readonly id: string;
  readonly portalId?: string | null;
  readonly guid?: string | null;
  readonly name?: string | null;
  readonly action?: string | null;
  readonly method?: string | null;
  readonly cssClass?: string | null;
  readonly redirect?: string | null;
  readonly submitText?: string | null;
  readonly followUpId?: string | null;
  readonly notifyRecipients?: string | null;
  readonly leadNurturingCampaignId?: string | null;
  readonly formFieldGroups?: ReadonlyArray<IHubspotFormFieldGroupsDefinition | null> | null;
  readonly metaData?: ReadonlyArray<IHubspotFormMetaDataDefinition | null> | null;
  readonly inlineMessage?: string | null;
  readonly isPublished?: boolean | null;
  readonly thankYouMessageJson?: string | null;
}

export interface IHubspotFormMetaDataDefinition {
  readonly __typename?: 'HubspotFormMetaData';
  readonly name?: string | null;
  readonly value?: string | null;
}

export interface IHubspotFormFieldGroupsDefinition {
  readonly __typename?: 'HubspotFormFormFieldGroups';
  readonly fields?: ReadonlyArray<IHubspotFormFieldDefinition | null> | null;
  readonly default?: boolean | null;
  readonly isSmartGroup?: boolean | null;
  readonly richText?: IHubspotFormRichTextDefinition | null;
  readonly isPageBreak?: boolean | null;
}

export interface IHubspotFormRichTextDefinition {
  readonly __typename?: 'HubspotFormFormFieldGroupsRichText';
  readonly content?: string | null;
  readonly type?: string | null;
}

export interface IHubspotFormFieldDefinition {
  readonly __typename?: 'HubspotFormFormFieldGroupsFields';
  readonly name?: string | null;
  readonly label?: string | null;
  readonly type?: string | null;
  readonly fieldType?: string | null;
  readonly description?: string | null;
  readonly groupName?: string | null;
  readonly displayOrder?: number | null;
  readonly required?: boolean | null;
  readonly options?: ReadonlyArray<IHubspotFormFormFieldOptionsDefinition | null> | null;
  readonly validation?: IHubspotFormFormFieldValidationDefinition | null;
  readonly enabled?: boolean | null;
  readonly hidden?: boolean | null;
  readonly defaultValue?: string | null;
  readonly isSmartField?: boolean | null;
  readonly unselectedLabel?: string | null;
  readonly placeholder?: string | null;
  readonly dependentFieldFilters?: ReadonlyArray<IHubspotFormFormDependentFieldDefinition | null> | null;
  readonly labelHidden?: boolean | null;
  readonly propertyObjectType?: string | null;
  readonly objectTypeId?: string | null;
}

export interface IHubspotFormFormFieldOptionsDefinition {
  readonly __typename?: 'HubspotFormFormFieldGroupsFieldsOptions';
  readonly label?: string | null;
  readonly value?: string | null;
  readonly displayOrder?: number | null;
  readonly doubleData?: number | null;
  readonly hidden?: boolean | null;
  readonly description?: string | null;
  readonly readOnly?: boolean | null;
}

export interface IHubspotFormFormFieldValidationDefinition {
  readonly __typename?: 'HubspotFormFormFieldGroupsFieldsValidation';
  readonly name?: string | null;
  readonly message?: string | null;
  readonly data?: string | null;
  readonly useDefaultBlockList?: boolean | null;
}

export interface IHubspotFormFormDependentFieldDefinition {
  readonly __typename?: 'HubspotFormFormFieldGroupsFieldsDependentFieldFilters';
  readonly filters?: ReadonlyArray<IHubspotFormFormDependentFieldFiltersDefinition | null> | null;
  readonly dependentFormField?: Omit<
    IHubspotFormFieldDefinition,
    'dependentFieldFilters'
  > | null;
  readonly formFieldAction?: string | null;
}

export interface IDynamicFormState {
  isDirty: boolean;
  form?: HTMLFormElement | null;
}

export interface IHubspotFormFormDependentFieldFiltersDefinition {
  readonly __typename?: 'HubspotFormFormFieldGroupsFieldsDependentFieldFiltersFilters';
  readonly operator?: string | null;
  readonly strValue?: string | null;
  readonly boolValue?: boolean | null;
  readonly numberValue?: number | null;
  readonly strValues?: ReadonlyArray<string | null> | null;
}

export type IHubspotFormFieldGroup = ReadonlyArray<IHubspotFormFieldDefinition>;

export type IHubspotFormSubmitBody = {
  fields: {
    objectTypeId: string | undefined;
    name: string;
    value: string;
  }[];
  context: {
    pageName: string;
    pageUri: string;
    hutk: string;
    ipAddress: string;
  };
};

export function makeInputId(
  formName: string,
  fieldName?: string | null
): string | undefined {
  if (fieldName) {
    return `${formName}#${fieldName}`;
  }

  return undefined;
}
