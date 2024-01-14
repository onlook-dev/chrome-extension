import {
	deleteObjectFromCollection,
	getObjectFromCollection,
	postObjectToCollection
} from '$lib/firebase/firestore'
import type { Project } from '$models/project'
import { FIREBASE_COLLECTION_PROJECTS } from '$lib/utils/constants'

export async function getProjectFromFirebase(projectId: string): Promise<Project> {
	const projectData = await getObjectFromCollection(FIREBASE_COLLECTION_PROJECTS, projectId)
	return projectData as Project
}

export async function postProjectToFirebase(project: Project): Promise<string | undefined> {
	console.log('Posting firebase project')
	const objectId = await postObjectToCollection(FIREBASE_COLLECTION_PROJECTS, project, project.id)
	console.log('Posted firebase project with ID', objectId)
	return objectId
}

export async function deleteProjectFromFirebase(projectId: string): Promise<void> {
	console.log('Deleting firebase project')
	const result = await deleteObjectFromCollection(FIREBASE_COLLECTION_PROJECTS, projectId)
	console.log('Deleted firebase project with ID', projectId)
	return result
}