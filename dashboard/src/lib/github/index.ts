import { Octokit } from "@octokit/core";
import { getInstallationOctokit } from './installation';
import { fetchFileFromPath } from './files';

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
}