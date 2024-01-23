export interface GithubAuth {
  id: string;
  installationId: string;
}

export interface GithubSettings {
  auth: string;
  repo: string;
  owner: string;
  rootPath: string;
  baseBranch: string;
}
