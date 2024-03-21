import { Octokit } from "@octokit/core";
import { getInstallationOctokit } from './installation';
import { createCommit } from './commits';
import { createOrGetBranch } from './branches';
import { createOrGetPullRequest } from './pullRequests';
import { Activity } from "$shared/models/activity";
import { getTranslationInput, updateContentChunk } from '$shared/translation';
import { fetchFileFromPath, getPathInfo } from './files';

import type { FileContentData, TranslationInput, TranslationOutput } from '$shared/models/translation';
import type { Project } from "$shared/models/project";
import type { User } from "$shared/models/user";

export class GithubService {
  octokit: Octokit;

  constructor(installationId: string) {
    this.octokit = getInstallationOctokit(installationId);
  }

  async publishProjectToGitHub(
    project: Project,
    title: string,
    description: string,
    user: User
  ): Promise<string> {

    if (!project?.installationId) {
      console.error('Project has no installation ID');
      throw 'Export failed: Project has no installation ID';
    }

    if (!project.githubSettings) {
      console.error('No github settings found for this project');
      throw 'Export failed: No github settings found for this project';
    }

    const githubSettings = project.githubSettings;

    const commitDetails: Map<string, FileContentData> = await this.prepareCommit(
      this.octokit,
      githubSettings.owner,
      githubSettings.repositoryName,
      githubSettings.baseBranch,
      githubSettings.rootPath,
      project.activities
    );

    if (commitDetails.size === 0) {
      console.error('No commit details found');
      throw 'Export failed: No commit details found';
    }

    console.log('prepared new commit');

    const branchName = `onlook-${project.id}`;
    const branchFound = await createOrGetBranch(
      this.octokit,
      githubSettings.owner,
      githubSettings.repositoryName,
      githubSettings.baseBranch,
      branchName
    );

    if (!branchFound) {
      console.error('Failed to create or fetch branch');
      throw 'Export failed: Failed to create or fetch branch';
    }

    const commitId = await createCommit(
      this.octokit,
      githubSettings.owner,
      githubSettings.repositoryName,
      branchName,
      Array.from(commitDetails.values()),
      user,
      title
    );

    console.log('created new commit');

    const { pullRequestNumber, pullRequestUrl } = await createOrGetPullRequest(
      this.octokit,
      githubSettings.owner,
      githubSettings.repositoryName,
      githubSettings.baseBranch,
      title,
      description,
      branchName
    );

    console.log('created new pr: ', pullRequestUrl);
    return pullRequestUrl;
  }

  async prepareCommit(
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

    // Remove activities without a path
    const filteredActivities = Object.values(activities).filter(
      (activity: Activity) => activity.path
    );

    filteredActivities.forEach((activity: Activity) => {
      if (!activity.path) {
        console.error('No path found for activity');
        return;
      }

      const pathInfo = getPathInfo(activity.path, rootPath);
      if (!fileDataMap.has(pathInfo.path)) {
        const fetchPromise = fetchFileFromPath(octokit, owner, repo, branch, pathInfo.path).then(
          (fileContentData: FileContentData | undefined) => {
            if (!fileContentData) {
              console.error('File content not found for path: ', pathInfo.path);
            } else {
              fileDataMap.set(pathInfo.path, fileContentData);
            }
          }
        );
        fetchPromises.push(fetchPromise);
      }
    });

    await Promise.all(fetchPromises);

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

      const newContent = updateContentChunk(
        fileContentData.content,
        translation.codeChunk,
        translation.pathInfo
      );
      fileContentData.content = newContent;
    });

    console.log('fileDataMap after', fileDataMap);
    return fileDataMap;
  }
}