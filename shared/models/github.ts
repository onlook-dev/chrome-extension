export interface GithubAuth {
  id: string;
  installationId: string;
}

export interface GithubSettings {
  auth: string;
  repositoryName: string;
  owner: string;
  rootPath: string;
  baseBranch: string;
}

export interface GithubRepo {
  id: number;
  name: string;
  owner: string;
}
