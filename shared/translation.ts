import type { Activity, ChangeValues } from "./models/activity";
import type { EditEvent } from "./models/editor";
import type { PathInfo, TranslationInput } from "./models/translation";

export function getTranslationInput(content: string, pathInfo: PathInfo, activity: Activity): TranslationInput {
  const codeChunk = content.split('\n').slice(pathInfo.startLine - 1, pathInfo.endLine).join('\n');

  const newCss = Object.values(activity.styleChanges ?? {}).map((styleChange) => {
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

export function convertEditEventToStyleChangeMap(
  editEvent: EditEvent
): Record<string, ChangeValues> {
  const styleChangeMap: Record<string, ChangeValues> = {};
  Object.entries(editEvent.newVal).forEach(([style, newVal]) => {
    const oldVal = editEvent.oldVal as Record<string, string>;
    styleChangeMap[style] = { key: style, oldVal: oldVal[style], newVal };
  });
  return styleChangeMap;
}
