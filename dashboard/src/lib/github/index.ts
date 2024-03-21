import { fetchFileFromPath } from './files';
import { createOrGetBranch } from "./branches";
import { FileContentData } from "$shared/models/translation";
import { createCommit } from "./commits";
import { CustomOctokit, getOctokitByInstallationId } from "./octokit";
import { createOrGetPullRequest } from "./pullRequests";
export class GithubService {
  octokit: CustomOctokit;

  constructor(
    private installationId: string,
    private owner: string,
    private repo: string,
    private baseBranch: string,
  ) {
    this.octokit = getOctokitByInstallationId(this.installationId);
  }

  fetchFileFromPath(path: string) {
    return fetchFileFromPath(
      this.octokit, this.owner,
      this.repo,
      this.baseBranch,
      path
    );
  }

  createOrGetBranch(branchName: string) {
    return createOrGetBranch(
      this.octokit,
      this.owner,
      this.repo,
      this.baseBranch,
      branchName
    )
  }

  createCommitFromFiles(
    branch: string,
    authorName: string,
    authorEmail: string,
    message: string,
    files: FileContentData[]
  ) {
    return createCommit(
      this.octokit,
      this.owner,
      this.repo,
      branch,
      authorName,
      authorEmail,
      message,
      files
    )
  }

  createOrGetPullRequest(
    title: string,
    description: string,
    newBranch: string
  ) {
    return createOrGetPullRequest(
      this.octokit,
      this.owner,
      this.repo,
      this.baseBranch,
      title,
      description,
      newBranch
    )
  }
}