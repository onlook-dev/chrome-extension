import type { Activity, ChangeValues, TemplateNode, StyleTranslationInput, TextTranslationInput } from "$shared/models";
import { getTemplateContent } from "@onlook/helpers";
import { getExtensionFromPath } from "./helpers";

export function getStyleTranslationInput(content: string, templateNode: TemplateNode, activity: Activity): StyleTranslationInput {
  const { startTagContent } = getTemplateContent(content, templateNode);
  const css = getCssStringFromStyleChanges(activity.styleChanges);
  const framework = getExtensionFromPath(templateNode.path);
  const tailwind = activity.attributeChanges ? getTailwindStringFromAttributeChange(activity.attributeChanges) : '';
  return {
    framework,
    css,
    code: startTagContent,
    tailwind
  }
}

export function getTextTranslationInput(content: string, templateNode: TemplateNode, activity: Activity): TextTranslationInput {
  if (!activity.textChanges) throw new Error('Text changes are required for text translation');

  const { startTagContent, childrenContent, endTagContent } = getTemplateContent(content, templateNode);
  const { oldText, newText } = getTextFromTextChanges(activity.textChanges);
  const framework = getExtensionFromPath(templateNode.path);

  return {
    framework,
    oldText,
    newText,
    code: `${startTagContent}${childrenContent}${endTagContent}`
  }
}

export const getCssStringFromStyleChanges = (styleChanges: Record<string, ChangeValues>) => {
  return Object.values(styleChanges).map((styleChange) => {
    return `${styleChange.key}: ${styleChange.newVal}`;
  }).join('; ');
}

export const getTailwindStringFromAttributeChange = (attributeChange: Record<string, ChangeValues>) => {
  return attributeChange.updated?.newVal ?? "";
}

export const getTextFromTextChanges = (textChanges: Record<string, ChangeValues>) => {
  const oldText = textChanges.text?.oldVal ?? '';
  const newText = textChanges.text?.newVal ?? '';
  return { oldText, newText };
}

