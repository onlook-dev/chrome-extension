import type { ProcessedActivity, PathInfo, Activity } from "$shared/models";

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

export function updateContentChunk(file: string, newContentChunk: string, pathInfo: PathInfo, full: boolean): string {
  let lines = file.split('\n');
  if (lines.length === 0) return file;

  let endLine = full ? pathInfo.endLine : pathInfo.startTagEndLine || pathInfo.endLine;

  // Ensure startLine and endLine are within the bounds of the file
  if (pathInfo.startLine < 1 || pathInfo.startLine > lines.length || endLine < pathInfo.startLine || endLine > lines.length) {
    throw new Error('startLine or endLine out of file bounds');
  }

  // Split the new content chunk into lines
  let newContentLines = newContentChunk.split('\n');

  // Variables to keep track of the last detected indentation
  let lastDetectedIndentation = '';
  let adjustedNewContentLines = [];

  // Process each line within the original section to be replaced
  for (let i = 0; i < endLine - pathInfo.startLine + 1; i++) {
    const originalLineIndex = pathInfo.startLine - 1 + i;
    let currentIndentation;

    if (i < newContentLines.length) {
      // Detect and apply indentation for lines within the new content chunk
      const indentationMatch = lines[originalLineIndex].match(/^\s*/);
      currentIndentation = indentationMatch ? indentationMatch[0] : '';
      adjustedNewContentLines.push(currentIndentation + newContentLines[i].trim());
    }

    // Update the last detected indentation if applicable
    if (currentIndentation !== undefined) {
      lastDetectedIndentation = currentIndentation;
    }
  }

  // Handle case when new content has more lines than the original section
  if (newContentLines.length > endLine - pathInfo.startLine + 1) {
    // Append extra new content lines with the last detected indentation
    for (let i = endLine - pathInfo.startLine + 1; i < newContentLines.length; i++) {
      adjustedNewContentLines.push(lastDetectedIndentation + newContentLines[i].trim());
    }
  }

  // Replace the specified lines with the newly adjusted content chunk
  lines.splice(pathInfo.startLine - 1, endLine - pathInfo.startLine + 1, ...adjustedNewContentLines);

  return lines.join('\n');
}
