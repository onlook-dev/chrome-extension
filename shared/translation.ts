import type { Activity, StyleChange } from "./models/activity";
import type { EditorStyleChange } from "./models/editor";
import type { TranslationInput } from "./models/translation";

const CLASS_MATCH = /(class|className)=["'`](.*?)["'`]/g

export function activityToTranslationInput(activity: Activity, pathInfo: { path: string }, currentValue: string): TranslationInput {
  const newValues = Object.values(activity.styleChanges).map((styleChange) => {
    return `${styleChange.key}: ${styleChange.newVal}`;
  });

  const translationInput: TranslationInput = {
    path: pathInfo.path,
    newCss: newValues,
    currentClasses: currentValue,
  } as TranslationInput

  return translationInput;
}

export function convertEditorToStyleChangeMap(
  editorStyleChange: EditorStyleChange
): Record<string, StyleChange> {
  const styleChangeMap: Record<string, StyleChange> = {};
  Object.entries(editorStyleChange.newVal).forEach(([style, newVal]) => {
    const oldVal = editorStyleChange.oldVal[style];
    styleChangeMap[style] = { key: style, oldVal, newVal };
  });
  return styleChangeMap;
}

export function updateContentClass(content: string, newClass: string, attribute: 'class' | 'className' = 'class'): string {
  // Check if the content contains class or className attributes
  let found = false;
  let updatedContent = content.replace(CLASS_MATCH, (match, p1, p2, offset, string) => {
    found = true; // Indicate that we found at least one class/className attribute
    const quoteType = match[match.length - 1]; // Get the quote type used in the attribute
    return `${p1}=${quoteType}${newClass}${quoteType}`; // Replace with newClass, preserving quote type
  });

  if (!found) {
    // If no class/className attribute is found, decide where to add it.
    updatedContent = content.replace(/(<\w+)(\s|>)/, `$1 ${attribute}="${newClass}"$2`);
  }

  return updatedContent;
}

export function getContentClass(content: string): string {
  const matches = [...content.matchAll(CLASS_MATCH)];
  return matches.length > 0 ? matches[0][2] : '';
}
