import type { Comment } from "./comment";
import type { HostData } from "./hostData";
import type { Activity } from "./activity";
import type { GithubSettings } from "./github";

// A project is a set of feedback, comments, and style changes
export interface Project {
  id: string;
  name: string;
  teamId: string;
  hostUrl: string;
  hostData: HostData;
  comments: Comment[];
  activities: Record<string, Activity>;
  createdAt: string;

  // Integrations
  githubHistoryIds: string[];
  githubSettings?: GithubSettings;
  installationId?: string;
}
