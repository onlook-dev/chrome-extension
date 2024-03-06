import * as admin from 'firebase-admin';

import {
	FIREBASE_COLLECTION_PROJECTS,
	FIREBASE_COLLECTION_TEAMS
} from '../../shared/constants';
import { Role, Team } from '../../shared/models/team';
import { Project } from '../../shared/models/project';

export async function duplicateTeam(
	teamId: string,
	userId: string,
	newProjectId: string,
	newTeamId: string
): Promise<Team> {
	const originalTeam = await admin
		.firestore()
		.collection(FIREBASE_COLLECTION_TEAMS)
		.doc(teamId)
		.get();

	if (!originalTeam.exists) {
		throw new Error('Original team not found');
	}

	const originalTeamData = originalTeam.data();

	const newUsers = { [userId]: Role.ADMIN };

	const newProjectIds = [newProjectId];

	return {
		...originalTeamData,
		id: newTeamId,
		users: newUsers,
		projectIds: newProjectIds
	} as Team;
}

export async function duplicateProject(
	projectId: string,
	newProjectId: string,
	newTeamId: string
): Promise<Project> {
	const originalProject = await admin
		.firestore()
		.collection(FIREBASE_COLLECTION_PROJECTS)
		.doc(projectId)
		.get();

	if (!originalProject.exists) {
		throw new Error('Original project not found');
	}

	const originalProjectData = originalProject.data();

	return {
		...originalProjectData,
		id: newProjectId,
		teamId: newTeamId
	} as Project;
}
