import { GithubAuthProvider, GoogleAuthProvider, signInWithPopup, type User } from 'firebase/auth'
import { auth } from './firebase'
import { UserImpl as FirebaseUserImpl } from '@firebase/auth/internal'
import { setBucketUser } from '../storage/user'
import { authUserBucket, userBucket } from '$lib/utils/localstorage'

// Use firebase user from dashboard
export function signInUser(userJson: string) {
	const userData = JSON.parse(userJson)
	const user: User = FirebaseUserImpl._fromJSON(auth as any, userData)
	auth
		.updateCurrentUser(user)
		.catch(err => {
			alert(`Sign in failed: ${JSON.stringify(err)}`)
		})
		.finally(() => {
			setBucketUser(user)
		})
}

export function subscribeToFirebaseAuthChanges() {
	auth.onAuthStateChanged(user => {
		if (user) {
			setBucketUser(user)
		} else {
			userBucket.clear()
		}
	})
}

export function signInWithGoogle() {
	const provider = new GoogleAuthProvider()
	signInWithPopup(auth, provider).catch(error => {
		// Handle Errors here.
		const errorCode = error.code
		const errorMessage = error.message
		const email = error.customData.email
		console.error('Error', errorCode, errorMessage, email)
	})
}

export function signInWithGithub() {
	const provider = new GithubAuthProvider()
	signInWithPopup(auth, provider).catch(error => {
		// Handle Errors here.
		const errorCode = error.code
		const errorMessage = error.message
		const email = error.customData.email
		console.error('Error', errorCode, errorMessage, email)
	})
}

export function signOut() {
	auth
		.signOut()
		.catch(error => {
			// An error happened.
			console.error(error)
		})
		.finally(() => {
			authUserBucket.clear()
			userBucket.clear()
		})
}
