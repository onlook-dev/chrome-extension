import { getInstallationOctokit } from './installation';
import { fetchFileFromPath } from './files';
import { createOrGetBranch } from "./branches";
import { FileContentData } from "$shared/models/translation";
import { createCommit } from "./commits";
import { CustomOctokit } from "./octokit";

export class GithubService {
  octokit: CustomOctokit;

  constructor(
    private installationId: string,
    private owner: string,
    private repo: string,
    private baseBranch: string,
  ) {
    this.octokit = getInstallationOctokit(this.installationId);
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
    authorName: string,
    authorEmail: string,
    message: string,
    files: FileContentData[]
  ) {
    return createCommit(
      this.octokit,
      this.owner,
      this.repo,
      this.baseBranch,
      authorName,
      authorEmail,
      message,
      files
    )
  }
}