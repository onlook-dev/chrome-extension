import type { FileContentData } from "$shared/models";
import type { CustomOctokit } from './octokit';

export async function fetchFileFromPath(
  octokit: CustomOctokit,
  owner: string,
  repo: string,
  branch: string,
  path: string,
  commit?: string
): Promise<FileContentData | undefined> {
  try {
    const ref = commit || branch;
    const contentResponse = await octokit.rest.repos.getContent({
      owner,
      repo,
      ref, // Use git commit over branch if it exists
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
      throw `The requested path ${path} is not a file.`;
    }
  } catch (e) {
    console.error(`Failed to fetch file from path ${path}. ${e}`);
    throw `Failed to fetch code from path. Ensure correct repository is set up and up to date.`;
  }
}