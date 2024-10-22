import { GithubAuthProvider, GoogleAuthProvider, signInWithPopup, type User as AuthUser } from 'firebase/auth'
import { auth } from './firebase'
import { UserImpl as FirebaseUserImpl } from '@firebase/auth/internal'
import {
	authUserBucket,
	projectsMapBucket,
	teamsMapBucket,
	userBucket,
} from '$lib/utils/localstorage'
import { FirebaseService } from '$lib/storage'
import { FirestoreCollections } from '$shared/constants'
import { identifyUser } from '$lib/mixpanel'

import type { User } from '$shared/models'

// Use firebase user from dashboard
export function signInUser(userData: any) {
	const user: AuthUser = FirebaseUserImpl._fromJSON(auth as any, userData)
	auth.updateCurrentUser(user).catch(err => {
		alert(`Sign in failed: ${JSON.stringify(err)}`)
	})
}

export function subscribeToFirebaseAuthChanges() {
	auth.onAuthStateChanged(authUser => {
		if (authUser) {
			const userService = new FirebaseService<User>(FirestoreCollections.USERS)
			userService.subscribe(authUser.uid, user => {
				userBucket.set({ user })
				identifyUser(user.id)
			})

		} else {
			// Clear data when signed out
			userBucket.clear()
			authUserBucket.clear()
			projectsMapBucket.clear()
			teamsMapBucket.clear()
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
