import {
	getObjectFromCollection,
	postObjectToCollection,
	subscribeToDocument
} from '$lib/firebase/firestore';
import { FIREBASE_COLLECTION_GITHUB, FIREBASE_COLLECTION_GITHUB_HISTORY } from '$shared/constants';
import type { GithubAuth, GithubHistory } from '$shared/models/github';

export async function getGithubAuthFromFirebase(authId: string): Promise<GithubAuth> {
	const githubAuthData = await getObjectFromCollection(FIREBASE_COLLECTION_GITHUB, authId);
	return githubAuthData as GithubAuth;
}

export async function postGithubAuthToFirebase(githubAuth: GithubAuth) {
	const objectId = await postObjectToCollection(
		FIREBASE_COLLECTION_GITHUB,
		githubAuth,
		githubAuth.id
	);
	console.log('Posted firebase github auth with ID', objectId);
	return;
}

export async function getGithubHistoryFromFirebase(
	githubHistoryId: string
): Promise<GithubHistory> {
	const githubHistoryData = await getObjectFromCollection(
		FIREBASE_COLLECTION_GITHUB_HISTORY,
		githubHistoryId
	);
	return githubHistoryData as GithubHistory;
}

export async function postGithubHistoryToFirebase(githubHistory: GithubHistory) {
	const objectId = await postObjectToCollection(
		FIREBASE_COLLECTION_GITHUB_HISTORY,
		githubHistory,
		githubHistory.id
	);
	console.log('Posted firebase github history with ID', objectId);
	return;
}

export async function getGithubHistoriesFromFirebase(
	githubHistoryIds: string[]
): Promise<GithubHistory[]> {
	const githubHistoriesData = await Promise.all(
		githubHistoryIds.map((id) => getGithubHistoryFromFirebase(id))
	);
	return githubHistoriesData;
}

export async function subscribeToGithubHistory(
	githubHistoryId: string,
	callback: (data: GithubHistory) => void
): Promise<() => void> {
	const unsubscribe = await subscribeToDocument(
		FIREBASE_COLLECTION_GITHUB_HISTORY,
		githubHistoryId,
		callback
	);
	return unsubscribe;
}
