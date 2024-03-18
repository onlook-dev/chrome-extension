import {
	getObjectFromCollection,
	postObjectToCollection,
	subscribeToDocument
} from '$lib/firebase/firestore';
import { FirestoreCollections } from '$shared/constants';
import type { GithubAuth, GithubHistory } from '$shared/models/github';

export async function getGithubAuthFromFirebase(authId: string): Promise<GithubAuth> {
	const githubAuthData = await getObjectFromCollection(FirestoreCollections.GITHUB, authId);
	return githubAuthData as GithubAuth;
}

export async function postGithubAuthToFirebase(githubAuth: GithubAuth) {
	const objectId = await postObjectToCollection(
		FirestoreCollections.GITHUB,
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
		FirestoreCollections.GITHUB_HISTORY,
		githubHistoryId
	);
	return githubHistoryData as GithubHistory;
}

export async function postGithubHistoryToFirebase(githubHistory: GithubHistory) {
	const objectId = await postObjectToCollection(
		FirestoreCollections.GITHUB_HISTORY,
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
		FirestoreCollections.GITHUB_HISTORY,
		githubHistoryId,
		callback
	);
	return unsubscribe;
}
