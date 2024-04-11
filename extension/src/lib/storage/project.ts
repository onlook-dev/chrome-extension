import { storeImageUri } from "$lib/firebase/functions";
import { FirestoreCollections } from "$shared/constants";
import { isBase64ImageString } from "$shared/helpers";
import type { Project } from "$shared/models/project";
import { FirebaseService } from ".";

export class FirebaseProjectService extends FirebaseService<Project> {
    constructor() {
        super(FirestoreCollections.PROJECTS);
    }

    async post(project: Project): Promise<string | undefined> {
        // For each activity, save the previewImage to filestorage
        for (const activity of Object.values(project.activities)) {
            const dataUri = activity.previewImage;
            if (!dataUri || !isBase64ImageString(dataUri)) continue;
            // Save previewImage to filestorage
            const result = await storeImageUri({ dataUri });
            activity.previewImage = result.data;
            project.activities[activity.selector] = activity;
        }
        return super.post(project);
    }
}