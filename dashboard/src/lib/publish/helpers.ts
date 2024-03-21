import type { Activity, ChangeValues } from "$shared/models/activity";
import type { ProcessedActivity, PathInfo, TranslationInput } from "$shared/models/translation";

export function getProcessedActivities(
  activities: Record<string, Activity>,
  rootPath: string
): ProcessedActivity[] {
  const processed = Object.values(activities)
    .map((activity) => {
      if (!activity.path) return null;
      return {
        activity,
        pathInfo: getPathInfo(activity.path, rootPath)
      } as ProcessedActivity;
    })
    .filter((activity): activity is ProcessedActivity => activity !== null);
  return processed
};

export function getPathInfo(activityPath: string, rootPath: string): PathInfo {
  const [filePath, startLine, startTagEndLine, endLine] = activityPath.split(':');
  return {
    path: rootPath === '.' || rootPath === '' || rootPath === '/'
      ? `${filePath}`
      : `${rootPath}/${filePath}`,
    startLine: parseInt(startLine),
    startTagEndLine: parseInt(startTagEndLine),
    endLine: parseInt(endLine),
  };
}

export function getTranslationInput(content: string, pathInfo: PathInfo, activity: Activity): TranslationInput {
  const code = getCodeChunkFromContent(content, pathInfo);
  const css = getCssStringFromStyleChanges(activity.styleChanges);
  const framework = getFrameworkFromPath(pathInfo.path);

  return {
    framework,
    css,
    code
  } as TranslationInput
}

export function updateContentChunk(file: string, newContentChunk: string, pathInfo: PathInfo): string {
  let lines = file.split('\n');
  if (!lines) return file;

  // Detect the indentation of the first line to be replaced
  const match = lines[pathInfo.startLine - 1].match(/^\s*/);
  const firstLineIndentation = match ? match[0] : '';

  // Apply the detected indentation to each line of the new content chunk
  const indentedNewContentChunk = newContentChunk.split('\n').map(line => firstLineIndentation + line).join('\n');

  // Replace the specified lines with the indented new content chunk
  lines.splice(pathInfo.startLine - 1, pathInfo.startTagEndLine - pathInfo.startLine + 1, indentedNewContentChunk);

  return lines.join('\n');
}

export const getCodeChunkFromContent = (content: string, pathInfo: PathInfo) => {
  return content.split('\n').slice(pathInfo.startLine - 1, pathInfo.startTagEndLine).join('\n');
}

export const getCssStringFromStyleChanges = (styleChanges: Record<string, ChangeValues>) => {
  return Object.values(styleChanges).map((styleChange) => {
    return `${styleChange.key}:${styleChange.newVal}`;
  }).join(';');
}

export const getFrameworkFromPath = (path: string) => {
  return path.split('.').pop() ?? 'html';
};
