import { getObjectFromCollection } from '$lib/firebase/firestore';
import type { Project } from '$models/project';
import { FIREBASE_COLLECTION_PROJECTS } from '$lib/utils/constants';

export async function getProjectFromFirebase(projectId: string): Promise<Project> {
	const projectData = await getObjectFromCollection(FIREBASE_COLLECTION_PROJECTS, projectId);
	return projectData as Project;
}
