import type { ProjectPreview } from "./project";

export interface User {
    id: string;
    name: string;
    email: string;
    version: number;
    profileImage?: string;
    teams: string[];
    projectPreviews?: ProjectPreview[];
    sharedProjectPreviews?: ProjectPreview[];
}
