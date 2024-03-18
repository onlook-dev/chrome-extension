
import { FirestoreCollections, MessageTypes } from '$shared/constants';
import { userStore } from '$lib/utils/store';
import type { User as FirebaseUser } from 'firebase/auth';
import { FirebaseService } from '.';
import type { User } from '$shared/models/user';

export async function setStoreUser(authUser: FirebaseUser) {
	// Send authUser to extension
	window.postMessage(
		{
			type: MessageTypes.DASHBOARD_AUTH,
			user: JSON.stringify(authUser.toJSON())
		},
		window.location.origin
	);

	const userServices = new FirebaseService<User>(FirestoreCollections.USERS);
	// Listen and update user from remote
	userServices.subscribe(authUser.uid, (user) => {
		userStore.set(user);
	});
}
