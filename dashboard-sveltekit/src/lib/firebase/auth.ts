import { GithubAuthProvider, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from './firebase';
import { setStoreUser } from '$lib/storage/user';
import { projectsMapStore, teamsMapStore, userStore, usersMapStore } from '$lib/utils/store';

export function subscribeToFirebaseAuthChanges() {
	auth.onAuthStateChanged((user) => {
		if (user) {
			setStoreUser(user);
		} else {
			console.log('User signed out');
			// Clear data when signed out
			userStore.set(undefined);
			usersMapStore.set(new Map());
			projectsMapStore.set(new Map());
			teamsMapStore.set(new Map());
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
