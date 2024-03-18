import {
	getObjectFromCollection,
	getObjectFromCollectionWhere,
	postObjectToCollection,
	subscribeToDocument
} from '$lib/firebase/firestore';
import { FirestoreCollections } from '$shared/constants';
import type { Team, Tier } from '$shared/models/team';

export async function getTeamFromFirebase(teamId: string): Promise<Team> {
	const teamData = await getObjectFromCollection(FirestoreCollections.TEAMS, teamId);
	return teamData as Team;
}

export async function postTeamToFirebase(team: Team) {
	const objectId = await postObjectToCollection(FirestoreCollections.TEAMS, team, team.id);
	console.log('Posted firebase team');
	return objectId;
}

export async function getTeamFromPaymentId(paymentId: string): Promise<Team> {
	const teamData = await getObjectFromCollectionWhere(
		FirestoreCollections.TEAMS,
		'paymentId',
		paymentId
	);
	return teamData as Team;
}


export async function subscribeToTeam(
	teamId: string,
	callback: (data: Team) => void
): Promise<() => void> {
	const unsubscribe = await subscribeToDocument(FirestoreCollections.TEAMS, teamId, callback);
	return unsubscribe;
}

export async function setTeamPaymentId(teamId: string, paymentId: string) {
	const team = await getTeamFromFirebase(teamId);
	team.paymentId = paymentId;
	await postTeamToFirebase(team);
}

export async function setTeamTier(teamId: string, tier: Tier) {
	const team = await getTeamFromFirebase(teamId);
	team.tier = tier;
	await postTeamToFirebase(team);
}
