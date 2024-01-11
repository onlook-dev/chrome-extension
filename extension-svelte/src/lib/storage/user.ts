import type { User } from 'firebase/auth'
import { get } from 'svelte/store'
import { getObjectFromCollection, postObjectToCollection } from '../firebase/firestore'
import { UserImpl } from '$lib/models/user'
import { FIREBASE_COLLECTION_USERS } from '$lib/utils/constants'
import { userBucket } from '$lib/utils/localstorage'

export async function getUserFromFirebase(userId: string): Promise<UserImpl | undefined> {
	console.log('Fetching firebase user')
	const userData = await getObjectFromCollection(FIREBASE_COLLECTION_USERS, userId)
	if (!userData) return undefined
	return new UserImpl(userData as UserImpl)
}

export async function postUserToFirebase(user: UserImpl) {
	console.log('Posting firebase user')
	const objectId = await postObjectToCollection(FIREBASE_COLLECTION_USERS, user, user.id)
	console.log('Posted firebase user with ID', objectId)
	return
}

export async function setBucketUser(authUser: User) {
	// Fetch from remote if no user in store
	getUserFromFirebase(authUser.uid).then(user => {
		if (!user) {
			console.log('Creating new user')
			// If user doesn't exist, create new user
			user = new UserImpl({
				id: authUser.uid,
				name: authUser.displayName ?? authUser.providerData[0].displayName ?? '',
				email: authUser.email ?? '',
				profileImage: authUser.photoURL ?? '',
				projectIds: [],
				projectPreviews: [],
				sharedProjectPreviews: [],
				version: 0
			})
			postUserToFirebase(user)
		}
		userBucket.set({ user })
		console.log('User set in bucket')
	})
}
