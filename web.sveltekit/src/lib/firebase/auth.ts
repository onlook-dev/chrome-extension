import { GithubAuthProvider, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from './firebase';
import { authUserStore } from '../utils/store';

export function subscribeToFirebaseAuthChanges() {
	auth.onAuthStateChanged((user) => {
		if (user) {
			authUserStore.set(user);
		} else {
			authUserStore.set(null);
		}
	});
}

export function signInWithGoogle() {
	const provider = new GoogleAuthProvider();
	signInWithPopup(auth, provider)
		.then((result) => {
			// const credential = GoogleAuthProvider.credentialFromResult(result);
			// const token = credential.accessToken;
			const user = result.user;
			authUserStore.set(user);
		})
		.catch((error) => {
			// Handle Errors here.
			const errorCode = error.code;
			const errorMessage = error.message;
			const email = error.customData.email;
			console.error('Error', errorCode, errorMessage, email);
		});
}

export function signInWithGithub() {
	const provider = new GithubAuthProvider();
	signInWithPopup(auth, provider)
		.then((result) => {
			// const credential = GoogleAuthProvider.credentialFromResult(result);
			// const token = credential.accessToken;
			const user = result.user;
			authUserStore.set(user);
		})
		.catch((error) => {
			// Handle Errors here.
			const errorCode = error.code;
			const errorMessage = error.message;
			const email = error.customData.email;
			console.error('Error', errorCode, errorMessage, email);
		});
}

export function signOut() {
	auth
		.signOut()
		.then(() => {
			authUserStore.set(null);
		})
		.catch((error) => {
			// An error happened.
			console.error(error);
		});
}
