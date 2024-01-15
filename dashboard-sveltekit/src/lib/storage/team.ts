import { getObjectFromCollection, postObjectToCollection } from '$lib/firebase/firestore';
import { FIREBASE_COLLECTION_TEAMS } from '$shared/constants';
import type { Team } from '$shared/models/team';

export async function getTeamFromFirebase(teamId: string): Promise<Team> {
	const teamData = await getObjectFromCollection(FIREBASE_COLLECTION_TEAMS, teamId);
	return teamData as Team;
}

export async function postTeamToFirebase(team: Team) {
	console.log('Posting firebase team');
	const objectId = await postObjectToCollection(FIREBASE_COLLECTION_TEAMS, team, team.id);
	console.log('Posted firebase team with ID', objectId);
	return;
}
