import type { FileContentData } from "$shared/models/translation";
import type { CustomOctokit } from './octokit';

export async function fetchFileFromPath(
  octokit: CustomOctokit,
  owner: string,
  repo: string,
  branch: string,
  path: string): Promise<FileContentData | undefined> {
  try {
    const contentResponse = await octokit.rest.repos.getContent({
      owner,
      repo,
      ref: branch,
      path,
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