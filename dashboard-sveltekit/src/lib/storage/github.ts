import { getObjectFromCollection, postObjectToCollection } from '$lib/firebase/firestore';
import { FIREBASE_COLLECTION_GITHUB } from '$shared/constants';
import type { GithubAuth } from '$shared/models/github';

export const getGithubAuthFromFirebase = async (authId: string): Promise<GithubAuth> => {
	const githubAuthData = await getObjectFromCollection(FIREBASE_COLLECTION_GITHUB, authId);
	return githubAuthData as GithubAuth;
};

export const postGithubAuthToFirebase = async (githubAuth: GithubAuth) => {
	const objectId = await postObjectToCollection(
		FIREBASE_COLLECTION_GITHUB,
		githubAuth,
		githubAuth.id
	);
	console.log('Posted firebase github auth with ID', objectId);
	return;
};
