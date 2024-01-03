import { getObjectFromCollection } from '$lib/firebase/firestore';
import { UserImpl } from '$lib/models/user';
import { FIREBASE_COLLECTION_USERS } from '$lib/utils/constants';

export async function getUserFromFirebase(userId: string): Promise<UserImpl | undefined> {
	console.log('Fetching firebase user');
	const userData = await getObjectFromCollection(FIREBASE_COLLECTION_USERS, userId);
	if (!userData) return userData;
	return new UserImpl(userData as UserImpl);
}
