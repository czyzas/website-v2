import { cmsStore } from '@/stores/cmsStore';
import { getStore } from './store';
import { parseImage } from './data-parsers/parseImage';
import type { UnparsedImage } from './data-parsers/parseImage';

export type ContentTypeWithFront =
  | 'CaseStudy'
  | 'Event'
  | 'Industry'
  | 'InsightsItem'
  | 'NewsroomItem'
  | 'Partner';

export const getDefaultImage = (postType: ContentTypeWithFront) => {
  const { subpageSettings, themeOptions } = getStore(cmsStore);
  const topImage = subpageSettings?.image;
  const defaultTopImages = themeOptions?.themeOptionsAcf?.defaultTopImages;

  let defaultTop: UnparsedImage;

  switch (postType) {
    case 'CaseStudy':
      defaultTop = defaultTopImages?.caseStudy;
      break;
    case 'Event':
      defaultTop = defaultTopImages?.event;
      break;
    case 'Industry':
      defaultTop = defaultTopImages?.industries;
      break;
    case 'InsightsItem':
      defaultTop = defaultTopImages?.insightsItem;
      break;
    case 'NewsroomItem':
      defaultTop = defaultTopImages?.newsroomItem;
      break;
    case 'Partner':
      defaultTop = defaultTopImages?.partner;
      break;
    default:
      defaultTop = defaultTopImages?.insightsItem;
      break;
  }

  return parseImage(topImage || defaultTop);
};
