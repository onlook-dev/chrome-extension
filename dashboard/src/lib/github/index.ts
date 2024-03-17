import type { User } from "$shared/models/user";
import { Octokit } from "@octokit/core";
import { getInstallationOctokit } from './installation';
import { createCommit, prepareCommit } from './commits';
import type { FileContentData } from '$shared/models/translation';
import { createOrGetBranch } from './branches';
import { createOrGetPullRequest } from './pullRequests';
import type { Project } from "$shared/models/project";

export class GitHubService {
  octokit: Octokit;
  user: User;

  constructor(installationId: string, user: User) {
    this.octokit = getInstallationOctokit(installationId);
    this.user = user;
  }

  async publishProjectToGitHub(
    project: Project,
    title: string,
    description: string
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

    const commitDetails: Map<string, FileContentData> = await prepareCommit(
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
      this.user,
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

}