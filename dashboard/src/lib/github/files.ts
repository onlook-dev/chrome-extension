import type { Octokit } from "@octokit/core";
import type { FileContentData, PathInfo } from "$shared/models/translation";
import { Endpoints } from "@octokit/types";

type GetContentsResponse = Endpoints["GET /repos/{owner}/{repo}/contents/{path}"]["response"];

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
    // @ts-ignore
    const contentResponse: GetContentsResponse = await octokit.request(`GET /repos/{owner}/{repo}/contents/{path}?ref={branch}`, {
      owner,
      repo,
      path,
      branch
    });

    if ('content' in contentResponse.data && contentResponse.data.content) {
      const decodedContent = atob(contentResponse.data.content);
      const fileData: FileContentData = {
        path,
        content: decodedContent,
        sha: contentResponse.data.sha ?? '',
      };
      return fileData;
    } else {
      // Handle cases where the content is not available, e.g., directory listings
      console.error(`The requested path ${path} is not a file.`);
      return undefined;
    }
  } catch (error) {
    console.error(`Failed to fetch content for ${path}:`, error);
  }
}