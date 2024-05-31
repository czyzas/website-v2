import type {
  AcfContentNodeConnection,
  CaseStudyCardFragment,
} from '@/__generated__/cms';

export function parseCaseStudies(unparsed?: AcfContentNodeConnection) {
  return (
    (unparsed?.nodes ?? []) as unknown as (CaseStudyCardFragment | undefined)[]
  )
    .filter(Boolean)
    .filter((p) => p.__typename === 'CaseStudy');
}

export function parseCaseStudyCustomer(caseStudy: CaseStudyCardFragment) {
  return caseStudy.caseStudyAcf?.relatedCustomer?.node.__typename === 'Customer'
    ? caseStudy.caseStudyAcf?.relatedCustomer?.node
    : undefined;
}
