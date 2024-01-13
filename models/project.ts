import type { Comment } from "./comment";
import type { HostData } from "./hostData";
import type { Activity } from "./activity";

// A project is a set of feedback, comments, and style changes
export interface Project {
  id: string;
  name: string;
  teamId: string;
  hostUrl: string;
  activities: Activity[];
  comments: Comment[];
  hostData: HostData;
}
