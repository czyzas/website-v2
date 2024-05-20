import { parse as parseHTML } from 'node-html-parser';
import type { ModulesModulesContentRichTextContentLayout } from '@/__generated__/cms';

type AllModules = (
  | { layoutName?: string; [key: string]: unknown }
  | undefined
)[];
type AllowedLayouts = ModulesModulesContentRichTextContentLayout;
const allowedLayouts = ['rich-text-content'] as const;

export const combineModulesToTOC = (modules: AllModules) => {
  const htmlArray: string[] = [];

  const filteredModules: AllowedLayouts[] = [];
  for (const module of modules) {
    if (module && allowedLayouts.includes(module.layoutName ?? '')) {
      filteredModules.push(module);
    }
  }

  for (const module of filteredModules) {
    if (module.__typename === 'ModulesModulesContentRichTextContentLayout') {
      htmlArray.push(module.content ?? '');
    }
  }

  return htmlArray.filter(Boolean).join('');
};

export const generateTOC = (html: string) => {
  const root = parseHTML(html);
  console.log(root);
};
