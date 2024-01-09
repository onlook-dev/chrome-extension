import { getObjectFromCollection } from '$lib/firebase/firestore';
import { ProjectImpl } from '$lib/models/project';
import { FIREBASE_COLLECTION_PROJECTS } from '$lib/utils/constants';

export async function getProjectFromFirebase(projectId: string): Promise<ProjectImpl> {
	const projectData = await getObjectFromCollection(FIREBASE_COLLECTION_PROJECTS, projectId);
	return new ProjectImpl(projectData as ProjectImpl);
}
