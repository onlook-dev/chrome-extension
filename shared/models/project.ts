import type { Comment } from "./comment";
import type { HostData } from "./hostData";
import type { Activity } from "./activity";
import type { GithubPublish, GithubSettings } from "./github";

// A project is a set of feedback, comments, and style changes
export interface Project {
  id: string;
  name: string;
  teamId: string;
  hostUrl: string;
  hostData: HostData;
  comments: Comment[];
  activities: Record<string, Activity>;
  createdAt?: string;

  // Integrations
  githubSettings?: GithubSettings;
  githubHistory?: GithubPublish[];
}
