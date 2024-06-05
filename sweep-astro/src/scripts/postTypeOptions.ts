import { cmsStore } from '@/stores/cmsStore';
import { TRANSLATIONS } from '@/constants';
import { getStore } from './store';
import type { UnparsedImage } from './data-parsers/parseImage';

export type ContentTypeWithFront =
  | 'CaseStudy'
  | 'Event'
  | 'Industry'
  | 'InsightsItem'
  | 'NewsroomItem'
  | 'Partner';

export function getDefaultTopImage(
  postType: ContentTypeWithFront
): UnparsedImage {
  const { themeOptions } = getStore(cmsStore);
  const postTypes = themeOptions?.themeOptionsAcf?.postTypeRelated;

  switch (postType) {
    case 'CaseStudy':
      return postTypes?.caseStudy?.defaultTopImage;
    case 'Event':
      return postTypes?.event?.defaultTopImage;
    case 'Industry':
      return postTypes?.industry?.defaultTopImage;
    case 'InsightsItem':
      return postTypes?.insights?.defaultTopImage;
    case 'NewsroomItem':
      return postTypes?.newsroom?.defaultTopImage;
    case 'Partner':
      return postTypes?.partner?.defaultTopImage;
    default:
      return undefined;
  }
}

export function getFeaturedArticleCtaText(
  postType: Extract<
    ContentTypeWithFront,
    'InsightsItem' | 'NewsroomItem' | 'Event'
  >
) {
  const { themeOptions } = getStore(cmsStore);
  const postTypes = themeOptions?.themeOptionsAcf?.postTypeRelated;

  let text: string | undefined = '';

  switch (postType) {
    case 'Event':
      text = postTypes?.event?.featuredArticleCtaText;
      break;
    case 'InsightsItem':
      text = postTypes?.insights?.featuredArticleCtaText;
      break;
    case 'NewsroomItem':
      text = postTypes?.newsroom?.featuredArticleCtaText;
      break;
    default:
      break;
  }

  return text || TRANSLATIONS.READ_MORE;
}
