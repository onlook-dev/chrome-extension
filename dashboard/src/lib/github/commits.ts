import type { Activity } from "$shared/models/activity";
import type { Octokit } from "@octokit/core";
import { fetchFileFromPath, getPathInfo, type FileContentData, type PathInfo } from "./files";
import type { TreeItem } from "$shared/models/github";

import { activityToTranslationInput, getContentClass, updateContentClass } from '$shared/translation';
import type { TranslationInput, TranslationOutput } from "$shared/models/translation";

async function getTranslationsFromServer(inputs: TranslationInput[]): Promise<TranslationOutput[]> {
  const messages = { role: 'user', content: `json: ${JSON.stringify({ "changes": inputs })}` };
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
  console.log('data', data);
  return JSON.parse(data.choices[0].message.content).changes;
}

function getTranslationInput(content: string, pathInfo: PathInfo, activity: Activity): TranslationInput {
  const newContent = content.split('\n').slice(pathInfo.startLine - 1, pathInfo.endLine).join('\n');
  const currentClasses = getContentClass(newContent);
  const translationInput = activityToTranslationInput(activity, pathInfo, currentClasses,);
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
  const fetchPromises: Promise<void>[] = [];
  const translationInputs: TranslationInput[] = [];

  // Get corresponding File for each activity
  Object.values(activities).forEach((activity: Activity) => {
    if (!activity.path) {
      console.error('No path found for activity');
      return;
    }
    const pathInfo = getPathInfo(activity.path, rootPath);
    if (!fileDataMap.has(pathInfo.path)) {
      const fetchPromise = fetchFileFromPath(octokit, owner, repo, branch, pathInfo.path).then((fileContentData: FileContentData) => {
        fileDataMap.set(pathInfo.path, fileContentData);
      })
      fetchPromises.push(fetchPromise);
    }
  })

  await Promise.all(fetchPromises)

  console.log('fileDataMap before', fileDataMap);

  // Get correponding TranslationInput for each activities
  Object.values(activities).forEach((activity: Activity) => {
    if (!activity.path) {
      console.error('No path found for activity');
      return;
    }
    const pathInfo = getPathInfo(activity.path, rootPath);
    const fileContentData = fileDataMap.get(pathInfo.path);
    if (!fileContentData) {
      console.error('No file content found for activity');
      return;
    }

    const translationInput = getTranslationInput(fileContentData.content, pathInfo, activity);
    translationInputs.push(translationInput);
  });

  console.log('translationInputs', translationInputs);

  // Get translations from server
  const translationOutput = await getTranslationsFromServer(translationInputs);
  console.log('translationOutput', translationOutput);

  // Write translations back into files
  translationOutput.forEach((translation: TranslationOutput) => {
    const fileContentData = fileDataMap.get(translation.pathInfo.path);
    if (!fileContentData) {
      console.error('No file content found for translation');
      return;
    }

    const newContent = updateContentChunk(fileContentData.content, translation.pathInfo, translation.classes);
    fileContentData.content = newContent;
  });

  console.log('fileDataMap after', fileDataMap);
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
