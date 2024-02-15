import {
	getObjectFromCollection,
	postObjectToCollection,
	subscribeToDocument
} from '$lib/firebase/firestore';
import { FIREBASE_COLLECTION_PROJECTS } from '$shared/constants';
import type { Project } from '$shared/models/project';

export async function getProjectFromFirebase(projectId: string): Promise<Project> {
	const projectData = await getObjectFromCollection(FIREBASE_COLLECTION_PROJECTS, projectId);
	return projectData as Project;
}

export async function postProjectToFirebase(project: Project) {
	const objectId = await postObjectToCollection(FIREBASE_COLLECTION_PROJECTS, project, project.id);
	console.log('Posted firebase project');
	return objectId;
}

export async function subscribeToProject(
	projectId: string,
	callback: (data: Project) => void
): Promise<() => void> {
	const unsubscribe = await subscribeToDocument(FIREBASE_COLLECTION_PROJECTS, projectId, callback);
	return unsubscribe;
}
