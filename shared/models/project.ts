import type { Comment } from "./comment";
import type { HostData } from "./hostData";
import type { Activity } from "./activity";
import type { GithubSettings } from "./github";

export interface Project {
  id: string;
  name: string;
  teamId: string;
  hostUrl: string;
  hostData: HostData;
  comments: Comment[];
  activities: Record<string, Activity>;
  createdAt: string;

  githubHistoryIds: string[];
  githubSettings?: GithubSettings;
  installationId?: string;
}
