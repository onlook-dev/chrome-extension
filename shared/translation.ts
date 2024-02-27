import type { Activity, StyleChange } from "./models/activity";
import type { EditorStyleChange } from "./models/editor";
import type { TranslationInput } from "./models/translation";

export function activityToTranslationInput(activity: Activity): TranslationInput {
  if (!activity.path) throw new Error('Path is required');

  const [path, startLine, endLine] = activity.path.split(':');
  const currentValue = getSourceCode(activity);
  const newValues = Object.values(activity.styleChanges).map((styleChange) => {
    return `${styleChange.key}: ${styleChange.newVal}`;
  });

  const translationInput: TranslationInput = {
    path,
    selector: activity.selector,
    newValues: newValues,
    startLine,
    endLine,
    currentValue,
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


// fetch file here
export function getSourceCode(githubDetails: any) {
  const githubQuery = `GITHUB_URL/{<org_name>}/{repo_name}/{path}#L{startLine}-L{endLine}`
  const currentValue = ''
  return currentValue;
}

export function updateFileContent(content: string, newClass: string, attribute: 'class' | 'className' = 'class'): string {
  // Check if the content contains class or className attributes
  let found = false;
  let updatedContent = content.replace(/(class|className)=["'`](.*?)["'`]/g, (match, p1, p2, offset, string) => {
    found = true; // Indicate that we found at least one class/className attribute
    const quoteType = match[match.length - 1]; // Get the quote type used in the attribute
    return `${p1}=${quoteType}${newClass}${quoteType}`; // Replace with newClass, preserving quote type
  });

  if (!found) {
    // If no class/className attribute is found, decide where to add it.
    // The example adds the class to the first element, adjusting as needed.
    // This uses double quotes by default for the added attribute.
    updatedContent = content.replace(/(<\w+)(\s|>)/, `$1 ${attribute}="${newClass}"$2`);
  }

  return updatedContent;
}
