import {
	getObjectFromCollection,
	postObjectToCollection,
	subscribeToDocument
} from '$lib/firebase/firestore';
import type { User } from '$shared/models/user';
import { MessageTypes, FirestoreCollections } from '$shared/constants';
import { userStore } from '$lib/utils/store';
import type { User as FirebaseUser } from 'firebase/auth';

export async function getUserFromFirebase(userId: string): Promise<User | undefined> {
	const userData = await getObjectFromCollection(FirestoreCollections.USERS, userId);
	if (!userData) return undefined;
	console.log('Got firebase user');
	return userData as User;
}

export async function postUserToFirebase(user: User) {
	const objectId = await postObjectToCollection(FirestoreCollections.USERS, user, user.id);
	console.log('Posted firebase user');
	return objectId;
}

export async function subscribeToUser(userId: string, callback: (data: User) => void) {
	const unsubscribe = await subscribeToDocument(FirestoreCollections.USERS, userId, callback);
	return unsubscribe;
}

export async function setStoreUser(authUser: FirebaseUser) {
	// Send authUser to extension
	window.postMessage(
		{
			type: MessageTypes.DASHBOARD_AUTH,
			user: JSON.stringify(authUser.toJSON())
		},
		window.location.origin
	);

	// Listen and update user from remote
	subscribeToUser(authUser.uid, (user) => {
		userStore.set(user);
	});
}
