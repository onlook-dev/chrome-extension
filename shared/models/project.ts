import type { Comment } from "./comment";
import type { HostData } from "./hostData";
import type { Activity } from "./activity";

// A project is a set of feedback, comments, and style changes
export interface Project {
  id: string;
  name: string;
  teamId: string;
  githubSettings: GithubSettings;
  hostUrl: string;
  hostData: HostData;
  comments: Comment[];
  activities: Record<string, Activity>;
}

export interface GithubAuth {
    id: string;

    installationId: string;
}

export interface GithubSettings {
    githubDataId: string;
    repositoryName: string;
    publisher: string;
    owner: string;
    baseBranch: string;
}