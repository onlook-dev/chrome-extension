import type { Octokit } from "@octokit/core";
import type { FileContentData, PathInfo } from "$shared/models/translation";

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

export async function fetchFileFromPath(
  octokit: Octokit,
  owner: string,
  repo: string,
  branch: string,
  path: string): Promise<FileContentData | undefined> {
  try {
    const contentResponse = await octokit.request(`GET /repos/${owner}/${repo}/contents/${path}?ref=${branch}`, {
      owner,
      repo,
      path,
    });
    const decodedContent = atob(contentResponse.data.content);
    const fileData: FileContentData = {
      path,
      content: decodedContent,
      sha: contentResponse.data.sha ?? '',
    };
    return fileData;
  } catch (error) {
    console.error(`Failed to fetch content for ${path}:`, error);
  }
}
