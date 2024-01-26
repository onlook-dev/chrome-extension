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
  name: string;
  owner: string;
}

export interface TreeItem {
  path: string;
  mode: "100644" | "100755" | "040000" | "160000" | "120000";
  type: "blob" | "tree" | "commit";
  content?: string;
  sha?: string | null;
}

export interface GithubPublish {
  id: string;
  title: string;
  description: string;
  userId: string;
  projectId: string;
  createdAt: string;
  pullRequestUrl: string;
}
