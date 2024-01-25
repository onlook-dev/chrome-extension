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

export interface TreeItem {
	path: string;
	mode: '100644' | '100755' | '040000' | '160000' | '120000';
	type: 'blob' | 'tree' | 'commit';
	content?: string;
	sha?: string | null;
};