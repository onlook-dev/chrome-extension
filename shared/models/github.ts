export interface GithubAuth {
  id: string;
  accessToken: string;
}

export interface GithubSettings {
  repo: string;
  author: string;
  root: string;
  auth: string;
}
