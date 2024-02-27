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