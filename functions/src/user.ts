import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import * as nanoid from 'nanoid';

import {
	FIREBASE_COLLECTION_USERS,
	FIREBASE_COLLECTION_TEAMS,
	FIREBASE_COLLECTION_PROJECTS
} from '../../shared/constants';
import { Team, Role } from '../../shared/models/team';
import type { User } from '../../shared/models/user';
import { duplicateProject, duplicateTeam } from '../utils/helpers';

const isProd = admin.instanceId().app.options.projectId === 'onlook-prod';

const PROD_DEMO_TEAM_ID = '_BwuInlxDTyQ7uQpcPbZv';
const PROD_DEMO_PROJECT_ID = 'deoFqIQc9ajpTQ-BBNcSv';
const DEV_DEMO_PROJECT_ID = 'yWM0zogZr-qvCQJY7CQ9w';
const DEV_DEMO_TEAM_ID = 'qt4M4GYqiL6ZEuME6ZGpb';

const DEMO_TEAM_ID = isProd ? PROD_DEMO_TEAM_ID : DEV_DEMO_TEAM_ID;
const DEMO_PROJECT_ID = isProd ? PROD_DEMO_PROJECT_ID : DEV_DEMO_PROJECT_ID;

export const createUser = functions.auth.user().onCreate(async (user) => {
	const defaultTeam = {
		id: nanoid.nanoid(),
		name: `${user.displayName}'s Team`,
		tier: 'Free',
		users: {
			[user.uid]: Role.ADMIN
		},
		projectIds: [],
		createdAt: new Date().toISOString()
	} as Team;

	const demoTeam = await duplicateTeam(DEMO_TEAM_ID, user.uid);
	const demoProject = await duplicateProject(DEMO_PROJECT_ID);

	// Create default team
	await admin
		.firestore()
		.collection(FIREBASE_COLLECTION_TEAMS)
		.doc(defaultTeam.id)
		.set(defaultTeam);

	// Create demo team
	await admin
		.firestore()
		.collection(FIREBASE_COLLECTION_TEAMS)
		.doc(demoTeam.id)
		.set(demoTeam);

	// Create demo project
	await admin
		.firestore()
		.collection(FIREBASE_COLLECTION_PROJECTS)
		.doc(demoProject.id)
		.set(demoProject);

	// Create user
	await admin
		.firestore()
		.collection(FIREBASE_COLLECTION_USERS)
		.doc(user.uid)
		.set({
			id: user.uid,
			name: user.displayName,
			email: user.email,
			profileImage: user.photoURL,
			teamIds: [defaultTeam.id, demoTeam.id]
		});
});

export const deleteUser = functions.auth.user().onDelete(async (user) => {
	const userRef = admin
		.firestore()
		.collection(FIREBASE_COLLECTION_USERS)
		.doc(user.uid);
	const userData: User = (await userRef.get()).data() as User;

	if (userData) {
		const teamIds: string[] = userData.teamIds;
		teamIds.forEach(async (teamId) => {
			const teamRef = admin
				.firestore()
				.collection(FIREBASE_COLLECTION_TEAMS)
				.doc(teamId);
			const teamData = (await teamRef.get()).data();

			if (!teamData) return;

			if (teamData && Object.keys(teamData.users).length === 1) {
				// Delete team if user is the only member
				await teamRef.delete();
			} else {
				// Remove user from team
				delete teamData.users[user.uid];
				await teamRef.update(teamData);
			}
		});
	}

	await userRef.delete();
});
