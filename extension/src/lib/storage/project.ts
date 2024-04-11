import { FirestoreCollections } from "$shared/constants";
import type { Project } from "$shared/models/project";
import { FirebaseService } from ".";

export class FirebaseProjectService extends FirebaseService<Project> {
    constructor() {
        super(FirestoreCollections.PROJECTS);
    }

    async post(project: Project): Promise<string | undefined> {
        // TODO: Process project.
        // For each activity, save the previewImage to filestorage
        return super.post(project);
    }
}