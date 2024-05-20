import { parse as parseHTML } from 'node-html-parser';
import type { ModulesCollectionFragment } from '@/__generated__/cms';
import type { ITableOfContentsEntry } from '@/types';

export const buildTOC = (
  modules: ModulesCollectionFragment['modulesContent']
) => {
  if (!modules) return [];

  const htmlArray = [];

  for (const module of modules) {
    if (!module) continue;
    if (module.__typename === 'ModulesModulesContentRichTextContentLayout') {
      htmlArray.push(module.content ?? '');
    }
  }
  const toc: ITableOfContentsEntry[] = [];
  const html = htmlArray.filter(Boolean).join('');
  const root = parseHTML(html);
  const headings = root.querySelectorAll('h1,h2,h3,h4,h5,h6');
  for (const heading of headings) {
    const id = heading.getAttribute('id');
    if (id) {
      toc.push({
        level: +heading.tagName.substring(1),
        label: heading.innerText,
        id,
      });
    }
  }

  return toc;
};
