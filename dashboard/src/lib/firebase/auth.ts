import { GithubAuthProvider, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

import { auth } from './firebase';
import {
	githubHistoryMapStore,
	projectsMapStore,
	teamsMapStore,
	userStore,
	usersMapStore
} from '$lib/utils/store';
import { FirestoreCollections, MessageTypes } from '$shared/constants';
import { FirebaseService } from '$lib/storage';
import type { User } from '$shared/models/user';
import { clearUser, identifyUser, trackEvent } from '$lib/mixpanel';

export function subscribeToFirebaseAuthChanges() {
	auth.onAuthStateChanged((authUser) => {
		if (authUser) {
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

			identifyUser(authUser.uid);
			trackEvent('login', { method: 'google' });
		} else {
			// Clear data when signed out
			userStore.set(undefined);
			usersMapStore.set(new Map());
			projectsMapStore.set(new Map());
			githubHistoryMapStore.set(new Map());
			teamsMapStore.set(new Map());
			clearUser();
		}
	});
}

export function signInWithGoogle() {
	const provider = new GoogleAuthProvider();
	signInWithPopup(auth, provider).catch((error) => {
		// Handle Errors here.
		const errorCode = error.code;
		const errorMessage = error.message;
		const email = error.customData.email;
		console.error('Error', errorCode, errorMessage, email);
	});
}

export function signInWithGithub() {
	const provider = new GithubAuthProvider();
	signInWithPopup(auth, provider).catch((error) => {
		// Handle Errors here.
		const errorCode = error.code;
		const errorMessage = error.message;
		const email = error.customData.email;
		console.error('Error', errorCode, errorMessage, email);
	});
}

export function signOut() {
	auth.signOut().catch((error) => {
		// An error happened.
		console.error(error);
	});
}
