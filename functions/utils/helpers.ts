import * as admin from 'firebase-admin';

import {
	FIREBASE_COLLECTION_PROJECTS,
	FIREBASE_COLLECTION_TEAMS
} from '../../shared/constants';
import { Project } from '../../shared/models/project';
import { Team } from '../../shared/models/team';

export async function duplicateProject(
	projectId: string,
	newProjectId: string,
	teamId: string
): Promise<Project | undefined> {
	const originalProject = await admin
		.firestore()
		.collection(FIREBASE_COLLECTION_PROJECTS)
		.doc(projectId)
		.get();

	if (!originalProject.exists) {
		console.error('Original project not found');
		return undefined;
	}

	const originalProjectData = originalProject.data();

	return {
		...originalProjectData,
		id: newProjectId,
		teamId: teamId
	} as Project;
}

export async function addProjectsToTeam(
	teamId: string,
	projectIds: string[]
): Promise<Team | undefined> {
	const team = admin
		.firestore()
		.collection(FIREBASE_COLLECTION_TEAMS)
		.doc(teamId)
		.get();

	if (!team) {
		console.error('Team not found');
		return;
	}

	const teamData = (await team).data() as Team;

	if (!teamData) {
		console.error('Team data not found');
		return;
	}

	const currentProjects = teamData.projectIds;

	// Filter out projects already in the team
	const newProjects = projectIds.filter(
		(projectId) => !currentProjects.includes(projectId)
	);

	if (newProjects.length === 0) {
		console.error('No new projects');
		return;
	}

	await admin
		.firestore()
		.collection(FIREBASE_COLLECTION_TEAMS)
		.doc(teamId)
		.update({
			projects: [...currentProjects, ...newProjects]
		});

	return {
		...teamData,
		projects: [...currentProjects, ...newProjects]
	} as Team;
}
