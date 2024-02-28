import type { Activity } from "$shared/models/activity";
import type { Octokit } from "@octokit/core";
import { fetchFileFromPath, getPathInfo, type FileContentData, type PathInfo } from "./files";
import type { TreeItem } from "$shared/models/github";

import { activityToTranslationInput, getContentClass, updateContentClass } from '$shared/translation';
import type { TranslationInput, TranslationOutput } from "$shared/models/translation";

async function getTranslationsFromServer(inputs: TranslationInput[]): Promise<TranslationOutput[]> {
  const messages = inputs.map(input => ({ role: 'user', content: `json: ${JSON.stringify(input)}` }));
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ messages })
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  const data = await response.json();
  return data.choices.map(choice => JSON.parse(choice.message.content) as TranslationOutput);
}

function getTranslationInput(content: string, pathInfo: PathInfo, activity: Activity): TranslationInput {
  const newContent = content.split('\n').slice(pathInfo.startLine - 1, pathInfo.endLine).join('\n');
  const currentClasses = getContentClass(newContent);
  const translationInput = activityToTranslationInput(activity, pathInfo, currentClasses);
  return translationInput;
}

function updateContentChunk(content: string, pathInfo: PathInfo, newClass: string): string {
  let newContent = content.split('\n').slice(pathInfo.startLine - 1, pathInfo.endLine).join('\n');
  newContent = updateContentClass(newContent, newClass);
  // Merge new content back into content
  const contentLines = content.split('\n');
  contentLines.splice(pathInfo.startLine - 1, pathInfo.endLine - pathInfo.startLine + 1, newContent);
  return contentLines.join('\n');
}

export async function prepareCommit(
  octokit: Octokit,
  owner: string,
  repo: string,
  branch: string,
  rootPath: string,
  activities: Record<string, Activity>
): Promise<Map<string, FileContentData>> {
  const fileDataMap = new Map<string, FileContentData>();
  const fetchPromises: Promise<FileContentData | undefined>[] = [];
  const translationMap = new Map<string, { input: TranslationInput, pathInfo: PathInfo }>();

  // Get array of inputs
  Object.values(activities).forEach(async (activity) => {
    if (!activity.path) {
      console.error('No path found for activity');
      return;
    }
    const pathInfo = getPathInfo(activity.path, rootPath);
    if (!pathInfo) {
      console.error('No path info found for activity');
      return;
    }
    let fileData = fileDataMap.get(pathInfo.path);
    if (!fileData) {
      const fetchPromise = fetchFileFromPath(octokit, owner, repo, branch, pathInfo.path);
      fetchPromises.push(fetchPromise);
      fileData = await fetchPromise

      if (!fileData) {
        console.error('No file data found');
        return;
      }

      // Get translation input
      const translationInput = getTranslationInput(fileData.content, pathInfo, activity);
      translationMap.set(pathInfo.path, { input: translationInput, pathInfo });
      fileDataMap.set(pathInfo.path, fileData);
    }
  });

  // Wait for all promises to resolve before returning the map
  await Promise.all(fetchPromises);

  // Get translations from server
  const inputArray = Array.from(translationMap.values()).map((translation) => translation.input);
  const translationOutputs: TranslationOutput[] = await getTranslationsFromServer(inputArray);

  translationOutputs.forEach((output) => {
    const fileData = fileDataMap.get(output.path);
    const translation = translationMap.get(output.path);
    console.log("output", output)
    if (fileData && translation) {
      const newContent = updateContentChunk(fileData.content, translation.pathInfo, output.newClasses.join(' '));
      fileData.content = newContent;
    } else {
      console.error('No file data or translation found');
    }
  })
  return fileDataMap;
}


export async function createCommit(
  octokit: Octokit,
  owner: string,
  repo: string,
  branch: string,
  files: FileContentData[]
): Promise<string> {
  try {
    // Preparing the tree for the commit
    const trees: TreeItem[] = files.map((file) => ({
      path: file.path,
      mode: '100644', // mode is explicitly typed
      type: 'blob', // type is explicitly typed
      content: file.content
    }));

    // Getting the SHA of the latest commit on the branch
    const latestCommit = await octokit.request(`GET /repos/{owner}/{repo}/git/ref/{ref}`, {
      owner,
      repo,
      ref: `heads/${branch}`
    });
    const latestCommitSha = latestCommit.data.object.sha;

    // Creating a new tree in the repository
    const treeResponse = await octokit.request(`POST /repos/{owner}/{repo}/git/trees`, {
      owner,
      repo,
      tree: trees,
      base_tree: latestCommitSha // Use the latest commit SHA as the base tree
    });

    // Creating the commit pointing to the new tree
    const commitResponse = await octokit.request(`POST /repos/{owner}/{repo}/git/commits`, {
      owner,
      repo,
      message: 'Adding onlook comments to multiple files',
      tree: treeResponse.data.sha,
      parents: [latestCommitSha],
      author: {
        name: 'Onlook',
        email: 'erik@onlook.dev', // TODO: Add users' email here
        date: new Date().toISOString()
      },
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    });

    // Updating the reference of the branch to point to the new commit
    await octokit.request(`PATCH /repos/{owner}/{repo}/git/refs/heads/${branch}`, {
      owner,
      repo,
      sha: commitResponse.data.sha
    });

    return commitResponse.data.sha;
  } catch (error) {
    console.error('Failed to create commit:', error);
    return 'failed to create commit';
  }
}
