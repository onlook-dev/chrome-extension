import { Comment } from "./comment";
import { ChangeSet } from "./changeset";
import { HostData } from "./hostData";

// A project is a set of feedback, comments, and style changes
export interface ProjectPreview {
    id: string;
    name: string;
    teamId: string;
}

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
