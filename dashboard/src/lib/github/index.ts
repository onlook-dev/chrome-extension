import { Octokit } from "@octokit/core";
import { getInstallationOctokit } from './installation';
import { createCommit } from './commits';
import { createOrGetBranch } from './branches';
import { createOrGetPullRequest } from './pullRequests';
import { Activity } from "$shared/models/activity";
import { getTranslationInput } from '$shared/translation';
import { fetchFileFromPath } from './files';

import type { FileContentData } from '$shared/models/translation';
import { getPathInfo } from "$lib/translation/helpers";

export class GithubService {
  octokit: Octokit;

  constructor(private installationId: string) {
    this.octokit = getInstallationOctokit(this.installationId);
  }

  fetchFileFromPath(
    owner: string,
    repo: string,
    branch: string,
    path: string
  ) {
    return fetchFileFromPath(this.octokit, owner, repo, branch, path);
  }

  // async getFileMapFromActivities(
  //   octokit: Octokit,
  //   owner: string,
  //   repo: string,
  //   branch: string,
  //   rootPath: string,
  //   activities: Record<string, Activity>
  // ): Promise<Map<string, FileContentData>> {
  //   const fileDataMap = new Map<string, FileContentData>();
  //   const fetchPromises: Promise<void>[] = [];

  //   // Remove activities without a path
  //   const filteredActivities = Object.values(activities).filter(
  //     (activity: Activity) => activity.path
  //   );

  //   filteredActivities.forEach((activity: Activity) => {
  //     if (!activity.path) {
  //       console.error('No path found for activity');
  //       return;
  //     }

  //     const pathInfo = getPathInfo(activity.path, rootPath);
  //     if (!fileDataMap.has(pathInfo.path)) {
  //       const fetchPromise = fetchFileFromPath(octokit, owner, repo, branch, pathInfo.path).then(
  //         (fileContentData: FileContentData | undefined) => {
  //           if (!fileContentData) {
  //             console.error('File content not found for path: ', pathInfo.path);
  //           } else {
  //             fileDataMap.set(pathInfo.path, fileContentData);
  //           }
  //         }
  //       );
  //       fetchPromises.push(fetchPromise);
  //     }
  //   });

  //   await Promise.all(fetchPromises);
  //   return fileDataMap;
  // }

  // getTranslationInput(
  //   fileDataMap: Map<string, FileContentData>,
  //   activities: Record<string, Activity>,
  //   rootPath: string
  // ) {
  //   // Get correponding TranslationInput for each activities
  //   Object.values(activities).forEach((activity: Activity) => {
  //     if (!activity.path) {
  //       console.error('No path found for activity');
  //       return;
  //     }
  //     const pathInfo = getPathInfo(activity.path, rootPath);
  //     const fileContentData = fileDataMap.get(pathInfo.path);
  //     if (!fileContentData) {
  //       console.error('No file content found for activity');
  //       return;
  //     }

  //     const translationInput = getTranslationInput(fileContentData.content, pathInfo, activity);
  //     console.log('translationInput', translationInput);
  //   });

  //   console.log('translationInputs', translationInputs);

  //   // Get translations from server
  //   const translationOutput = await getTranslationsFromServer(translationInputs);
  //   console.log('translationOutput', translationOutput);

  //   // Write translations back into files
  //   // translationOutput.forEach((translation: TranslationOutput) => {
  //   //   const fileContentData = fileDataMap.get(translation.pathInfo.path);
  //   //   if (!fileContentData) {
  //   //     console.error('No file content found for translation');
  //   //     return;
  //   //   }

  //   //   const newContent = updateContentChunk(
  //   //     fileContentData.content,
  //   //     translation.codeChunk,
  //   //     translation.pathInfo
  //   //   );
  //   //   fileContentData.content = newContent;
  //   // });
  // }
}