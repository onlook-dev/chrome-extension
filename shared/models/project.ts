import type { Comment } from "./comment";
import type { HostData } from "./hostData";
import type { Activity } from "./activity";
import type { GithubSettings } from "./github";
import type { ProjectSettings } from "./projectSettings";

export interface Project {
  id: string;
  name: string;
  teamId: string;
  hostUrl: string;
  hostData: HostData;
  comments: Comment[];
  activities: Record<string, Activity>;
  createdAt: string;
  updatedAt?: string;
  status?: ProjectStatus;

  // GitHub
  githubHistoryIds: string[];
  githubSettings?: GithubSettings;
  installationId?: string;

  // Settings
  projectSettings?: ProjectSettings;
}

export enum ProjectStatus {
  DRAFT = "draft",
  PREPARED = "prepared",
  PUBLISHED = "published",
  ARCHIVED = "archived",
  DELETED = "deleted",
}