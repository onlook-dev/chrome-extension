import type { User as FirebaseUser } from 'firebase/auth'
import {
	getObjectFromCollection,
	postObjectToCollection,
	subscribeToDocument
} from '../firebase/firestore'
import type { User } from '../../../../shared/models/user'
import { FIREBASE_COLLECTION_USERS } from '$shared/constants'
import { userBucket } from '$lib/utils/localstorage'

export async function getUserFromFirebase(userId: string): Promise<User | undefined> {
	console.log('Fetching firebase user')
	const userData = await getObjectFromCollection(FIREBASE_COLLECTION_USERS, userId)
	if (!userData) return undefined
	return userData as User
}

export async function postUserToFirebase(user: User) {
	console.log('Posting firebase user')
	const objectId = await postObjectToCollection(FIREBASE_COLLECTION_USERS, user, user.id)
	console.log('Posted firebase user with ID', objectId)
	return
}

export async function subscribeToUser(userId: string, callback: (data: User) => void) {
	const unsubscribe = await subscribeToDocument(FIREBASE_COLLECTION_USERS, userId, callback)
	return unsubscribe
}

export async function setBucketUser(authUser: FirebaseUser) {
	// Fetch from remote if no user in store
	getUserFromFirebase(authUser.uid).then(user => {
		if (!user) {
			console.log('Creating new user')
			// If user doesn't exist, create new user
			user = {
				id: authUser.uid,
				name: authUser.displayName ?? authUser.providerData[0].displayName ?? '',
				email: authUser.email ?? '',
				profileImage: authUser.photoURL ?? '',
				teams: []
			}
		}
		userBucket.set({ user })
		console.log('User set in bucket')
	})
}
