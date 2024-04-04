import type { Activity, ChangeValues } from "$shared/models/activity";
import type { PathInfo, StyleTranslationInput, TextTranslationInput } from "$shared/models/translation";

export function getStyleTranslationInput(content: string, pathInfo: PathInfo, activity: Activity): StyleTranslationInput {
  const code = getCodeChunkFromContent(content, pathInfo, false);
  const css = getCssStringFromStyleChanges(activity.styleChanges);
  const framework = getFrameworkFromPath(pathInfo.path);
  const tailwind = activity.attributeChanges ? getTailwindStringFromAttributeChange(activity.attributeChanges) : '';
  return {
    framework,
    css,
    code,
    tailwind
  }
}

export function getTextTranslationInput(content: string, pathInfo: PathInfo, activity: Activity): TextTranslationInput {
  if (!activity.textChanges) throw new Error('Text changes are required for text translation');

  const code = getCodeChunkFromContent(content, pathInfo, true);
  const { oldText, newText } = getTextFromTextChanges(activity.textChanges);
  const framework = getFrameworkFromPath(pathInfo.path);

  return {
    framework,
    oldText,
    newText,
    code
  }
}

export const getCodeChunkFromContent = (content: string, pathInfo: PathInfo, full: boolean) => {
  let endLine = full ? pathInfo.endLine : pathInfo.startTagEndLine;
  return content.split('\n').slice(pathInfo.startLine - 1, endLine).join('\n');
}

export const getCssStringFromStyleChanges = (styleChanges: Record<string, ChangeValues>) => {
  return Object.values(styleChanges).map((styleChange) => {
    return `${styleChange.key}: ${styleChange.newVal}`;
  }).join('; ');
}

export const getTailwindStringFromAttributeChange = (attributeChange: Record<string, ChangeValues>) => {
  return attributeChange.updated.newVal;
}

export const getTextFromTextChanges = (textChanges: Record<string, ChangeValues>) => {
  const oldText = textChanges.text.oldVal;
  const newText = textChanges.text.newVal;
  return { oldText, newText };
}

export const getFrameworkFromPath = (path: string) => {
  return path.split('.').pop() ?? 'html';
};
