import type {
  AcfContentNodeConnection,
  CaseStudyCardFragment,
} from '@/__generated__/cms';
import { cleanArray } from '../cleanArray';

export function parseCaseStudies(unparsed?: AcfContentNodeConnection) {
  return (
    cleanArray(unparsed?.nodes) as unknown as CaseStudyCardFragment[]
  ).filter((p) => p.__typename === 'CaseStudy');
}

export function parseCaseStudyCustomer(caseStudy: CaseStudyCardFragment) {
  return caseStudy.caseStudyAcf?.relatedCustomer?.node.__typename === 'Customer'
    ? caseStudy.caseStudyAcf?.relatedCustomer?.node
    : undefined;
}
