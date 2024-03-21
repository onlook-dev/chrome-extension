import { PathInfo } from "$shared/models/translation";

export function getPathInfo(activityPath: string, rootPath: string): PathInfo {
  const [filePath, startLine, endLine] = activityPath.split(':');
  return {
    path: rootPath === '.' || rootPath === '' || rootPath === '/'
      ? `${filePath}`
      : `${rootPath}/${filePath}`,
    startLine: parseInt(startLine),
    endLine: parseInt(endLine),
  };
}