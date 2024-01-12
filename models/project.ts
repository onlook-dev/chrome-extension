import type { Comment } from "./comment";
import type { ChangeSet } from "./changeset";
import type { HostData } from "./hostData";

// A project is a set of feedback, comments, and style changes
export interface Project {
	id: string;
	name: string;
	teamId: string;
	hostUrl: string;
	changeSets: ChangeSet[];
	comments: Comment[];
	hostData: HostData;
	version: number;
}
