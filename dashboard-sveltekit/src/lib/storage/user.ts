import { getObjectFromCollection, postObjectToCollection } from '$lib/firebase/firestore';
import type { User } from '$models/user';
import { DASHBOARD_AUTH, FIREBASE_COLLECTION_USERS } from '$lib/utils/constants';
import { teamsMapStore, userStore } from '$lib/utils/store';
import type { User as FirebaseUser } from 'firebase/auth';
import { get } from 'svelte/store';
import { nanoid } from 'nanoid';
import { postTeamToFirebase } from './team';
import { Role, type Team } from '$models/team';

export async function getUserFromFirebase(userId: string): Promise<User | undefined> {
	console.log('Fetching firebase user');
	const userData = await getObjectFromCollection(FIREBASE_COLLECTION_USERS, userId);
	if (!userData) return undefined;
	console.log('Got firebase user');
	return userData as User;
}

export async function postUserToFirebase(user: User) {
	console.log('Posting firebase user');
	const objectId = await postObjectToCollection(FIREBASE_COLLECTION_USERS, user, user.id);
	console.log('Posted firebase user with ID', objectId);
	return;
}

export async function setStoreUser(authUser: FirebaseUser) {
	// Send authUser to extension
	window.postMessage(
		{
			type: DASHBOARD_AUTH,
			user: JSON.stringify(authUser.toJSON())
		},
		window.location.origin
	);

	// Fetch from remote if no user in store
	if (!get(userStore)) {
		getUserFromFirebase(authUser.uid).then((user) => {
			if (!user) {
				console.log('Creating new user');

				// Create default team
				const defaultTeam: Team = {
					id: nanoid(),
					name: 'My Team',
					projectIds: [],
					users: { [authUser.uid]: Role.ADMIN }
				} as Team;

				// If user doesn't exist, create new user
				user = {
					id: authUser.uid,
					name: authUser.displayName ?? authUser.providerData[0].displayName ?? '',
					email: authUser.email ?? '',
					profileImage: authUser.photoURL ?? '',
					teams: [defaultTeam.id]
				};
				postTeamToFirebase(defaultTeam);
				postUserToFirebase(user);

				// Add team to store
				teamsMapStore.update((teamsMap) => {
					teamsMap.set(defaultTeam.id, defaultTeam);
					return teamsMap;
				});
			}
			userStore.set(user);
		});
	}
}