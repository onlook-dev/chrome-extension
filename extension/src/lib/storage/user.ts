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
	const objectId = await postObjectToCollection(FIREBASE_COLLECTION_USERS, user, user.id)
	console.log('Posted firebase user')
	return
}

export async function subscribeToUser(userId: string, callback: (data: User) => void) {
	const unsubscribe = await subscribeToDocument(FIREBASE_COLLECTION_USERS, userId, callback)
	return unsubscribe
}

export async function setBucketUser(authUser: FirebaseUser) {
	console.log('Setting bucket user')

	subscribeToUser(authUser.uid, user => {
		userBucket.set({ user })
	})
}