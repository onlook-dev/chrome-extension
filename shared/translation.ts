import type { Activity, StyleChange } from "./models/activity";
import type { EditorStyleChange } from "./models/editor";
import type { PathInfo, TranslationInput } from "./models/translation";

export function getTranslationInput(content: string, pathInfo: PathInfo, activity: Activity): TranslationInput {
  const codeChunk = content.split('\n').slice(pathInfo.startLine - 1, pathInfo.endLine).join('\n');
  const newCss = Object.values(activity.styleChanges).map((styleChange) => {
    return `${styleChange.key}: ${styleChange.newVal}`;
  }).join('; ');

  return {
    pathInfo,
    codeChunk,
    newCss,
  } as TranslationInput
}

export function updateContentChunk(content: string, newContent: string, pathInfo: PathInfo): string {
  let lines = content.split('\n');
  lines.splice(pathInfo.startLine - 1, pathInfo.endLine - pathInfo.startLine + 1, ...newContent.split('\n'));
  return lines.join('\n');
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
