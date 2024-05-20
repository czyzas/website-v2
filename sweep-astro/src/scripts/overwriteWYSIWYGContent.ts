import { kebabCase } from 'lodash-es';
import { parse as parseHTML } from 'node-html-parser';
import type { ModulesCollectionFragment } from '@/__generated__/cms';

const OVERWRITE_WYSIWYG_CONTENT_FEATURE = {
  /**
   *  Add unique ids to headings based on their content
   * @default false
   */
  RICH_TEXT_CONTENT_HEADINGS_IDS: false,
} as const;

/**
 * Edit existing data that came from Wordpress before it is used/rendered
 */
export function overwriteWYSIWYGContent(
  modules: ModulesCollectionFragment['modulesContent'],
  features: Partial<
    Record<keyof typeof OVERWRITE_WYSIWYG_CONTENT_FEATURE, boolean>
  >
) {
  if (!modules) return;

  const RICH_TEXT_CONTENT_HEADINGS_IDS_COLLECTION: Record<string, number> = {};

  for (const module of modules) {
    if (!module) continue;
    if (
      features.RICH_TEXT_CONTENT_HEADINGS_IDS &&
      module.__typename === 'ModulesModulesContentRichTextContentLayout'
    ) {
      const content = module.content ?? '';
      const root = parseHTML(content);
      const headings = root.querySelectorAll('h1,h2,h3,h4,h5,h6');
      for (const heading of headings) {
        const originalId = heading.getAttribute('id');
        if (originalId) continue;
        const content = heading.innerText;
        const id = kebabCase(content);

        RICH_TEXT_CONTENT_HEADINGS_IDS_COLLECTION[id] =
          (RICH_TEXT_CONTENT_HEADINGS_IDS_COLLECTION[id] || 0) + 1;
        const counter = RICH_TEXT_CONTENT_HEADINGS_IDS_COLLECTION[id];

        let suffix = '';
        if (counter > 1) {
          suffix = `-${counter}`;
        }

        heading.setAttribute('id', `${id}${suffix}`);
      }

      module.content = root.toString();
    }
  }
}
