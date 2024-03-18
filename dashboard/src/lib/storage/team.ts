import {
	getObjectFromCollectionWhere,
} from '$lib/firebase/firestore';
import { FirestoreCollections } from '$shared/constants';
import type { Team, Tier } from '$shared/models/team';
import { FirebaseService } from '.';

export async function getTeamFromPaymentId(paymentId: string): Promise<Team> {
	const teamData = await getObjectFromCollectionWhere(
		FirestoreCollections.TEAMS,
		'paymentId',
		paymentId
	);
	return teamData as Team;
}

export async function setTeamPaymentId(teamId: string, paymentId: string) {
	const teamServices = new FirebaseService<Team>(FirestoreCollections.TEAMS);
	const team = await teamServices.get(teamId);
	team.paymentId = paymentId;
	await teamServices.post(team);
}

export async function setTeamTier(teamId: string, tier: Tier) {
	const teamServices = new FirebaseService<Team>(FirestoreCollections.TEAMS);
	const team = await teamServices.get(teamId);
	team.tier = tier;
	await teamServices.post(team);
}
