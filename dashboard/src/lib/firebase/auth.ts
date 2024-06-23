import { GithubAuthProvider, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

import { identifyMixpanelUser } from '$lib/mixpanel/client';
import { FirebaseService } from '$lib/storage';
import { USER_ID_KEY } from '$lib/utils/constants';
import {
	githubHistoryMapStore,
	projectsMapStore,
	teamsMapStore,
	userStore,
	usersMapStore
} from '$lib/utils/store';
import { FirestoreCollections } from '$shared/constants';
import { MessageType, } from '$shared/message';
import type { User } from '$shared/models';
import { sendMessage } from 'webext-bridge/window';
import { auth } from '.';

export function subscribeToFirebaseAuthChanges() {
	auth.onAuthStateChanged((authUser) => {
		if (authUser) {
			// Send authUser to extension
			sendMessage(MessageType.DASHBOARD_SIGN_IN, JSON.stringify(authUser) as any);

			// Listen and update user from remote
			(new FirebaseService<User>(FirestoreCollections.USERS)).subscribe(authUser.uid, (user) => {
				userStore.set(user);
				identifyMixpanelUser(user.id, {
					$name: user.name,
					$email: user.email,
					$avatar: user.profileImage,
					$created: user.createdAt
				});
			});
			localStorage.setItem(USER_ID_KEY, authUser.uid);
		} else {
			sendMessage(MessageType.DASHBOARD_SIGN_OUT, {});
			// Clear data when signed out
			userStore.set(undefined);
			usersMapStore.set(new Map());
			projectsMapStore.set(new Map());
			githubHistoryMapStore.set(new Map());
			teamsMapStore.set(new Map());
			localStorage.removeItem(USER_ID_KEY);
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
