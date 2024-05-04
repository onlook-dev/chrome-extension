import { storeImageUri } from "$lib/firebase/functions";
import { FirestoreCollections } from "$shared/constants";
import { isBase64ImageString } from "$shared/helpers";
import type { Project } from "$shared/models";
import { FirebaseService } from ".";

export class FirebaseProjectService extends FirebaseService<Project> {
    constructor() {
        super(FirestoreCollections.PROJECTS);
    }

    async post(project: Project): Promise<string | undefined> {
        // For each activity, save the beforeImage and previewImage to filestorage
        for (const activity of Object.values(project.activities)) {

            // Save previewImage to filestorage
            const previewImage = activity.previewImage;
            if (previewImage && isBase64ImageString(previewImage)) {
                const result = await storeImageUri({ dataUri: previewImage });
                activity.previewImage = result.data;
            }

            // Save beforeImage to filestorage
            const beforeImage = activity.beforeImage;
            if (beforeImage && isBase64ImageString(beforeImage)) {
                const result = await storeImageUri({ dataUri: beforeImage });
                activity.beforeImage = result.data;
            }

            project.activities[activity.selector] = activity;
        }

        // Save the project before and previewImage
        if (project.hostData) {
            let hostData = project.hostData || {};
            const beforeImage = hostData.beforeImage;
            if (beforeImage && isBase64ImageString(beforeImage)) {
                const result = await storeImageUri({ dataUri: beforeImage });
                hostData.beforeImage = result.data;
            }

            const previewImage = hostData.previewImage;
            if (previewImage && isBase64ImageString(previewImage)) {
                const result = await storeImageUri({ dataUri: previewImage });
                hostData.previewImage = result.data;
            }
            project.hostData = hostData;
        }

        return super.post(project);
    }
}