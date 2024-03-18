import {
	deleteObjectFromCollection,
	getObjectFromCollection,
	postObjectToCollection,
	subscribeToDocument
} from '$lib/firebase/firestore'
import type { Project } from '../../../../shared/models/project'
import { FirestoreCollections } from '$shared/constants'

export async function getProjectFromFirebase(projectId: string): Promise<Project> {
	const projectData = await getObjectFromCollection(FirestoreCollections.PROJECTS, projectId)
	return projectData as Project
}

export async function postProjectToFirebase(project: Project): Promise<string | undefined> {
	const objectId = await postObjectToCollection(FirestoreCollections.PROJECTS, project, project.id)
	console.log('Posted firebase project')
	return objectId
}

export async function deleteProjectFromFirebase(projectId: string): Promise<void> {
	const result = await deleteObjectFromCollection(FirestoreCollections.PROJECTS, projectId)
	console.log('Deleted firebase project')
	return result
}

export async function subscribeToProject(
	projectId: string,
	callback: (data: Project) => void
): Promise<() => void> {
	const unsubscribe = await subscribeToDocument(FirestoreCollections.PROJECTS, projectId, callback)
	return unsubscribe
}
