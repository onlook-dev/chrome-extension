import {
	getObjectFromCollection,
	postObjectToCollection,
	subscribeToDocument
} from '$lib/firebase/firestore';
import type { User } from '$shared/models/user';
import { DASHBOARD_AUTH, FIREBASE_COLLECTION_USERS } from '$shared/constants';
import { userStore } from '$lib/utils/store';
import type { User as FirebaseUser } from 'firebase/auth';

export async function getUserFromFirebase(userId: string): Promise<User | undefined> {
	console.log('Fetching firebase user');
	const userData = await getObjectFromCollection(FIREBASE_COLLECTION_USERS, userId);
	if (!userData) return undefined;
	console.log('Got firebase user');
	return userData as User;
}

export async function postUserToFirebase(user: User) {
	const objectId = await postObjectToCollection(FIREBASE_COLLECTION_USERS, user, user.id);
	console.log('Posted firebase user');
	return;
}

export async function subscribeToUser(userId: string, callback: (data: User) => void) {
	const unsubscribe = await subscribeToDocument(FIREBASE_COLLECTION_USERS, userId, callback);
	return unsubscribe;
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
	// Set default user while waiting for remote update
	setDefaultUser(authUser);

	// Listen and update user from remote
	subscribeToUser(authUser.uid, (user) => {
		userStore.set(user);
	});
}

export function setDefaultUser(authUser: FirebaseUser) {
	const user = {
		id: authUser.uid,
		name: authUser.displayName ?? authUser.providerData[0].displayName ?? '',
		email: authUser.email ?? '',
		profileImage: authUser.photoURL ?? '',
		teams: []
	} as User;
	userStore.set(user);
}
