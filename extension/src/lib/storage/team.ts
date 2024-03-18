import {
	getObjectFromCollection,
	postObjectToCollection,
	subscribeToDocument
} from '$lib/firebase/firestore'
import { FirestoreCollections } from '$shared/constants'
import type { Team } from '../../../../shared/models/team'

export async function getTeamFromFirebase(teamId: string): Promise<Team> {
	const teamData = await getObjectFromCollection(FirestoreCollections.TEAMS, teamId)
	return teamData as Team
}

export async function postTeamToFirebase(team: Team): Promise<string | undefined> {
	const objectId = await postObjectToCollection(FirestoreCollections.TEAMS, team, team.id)
	console.log('Posted firebase team')
	return objectId
}

export async function subscribeToTeam(teamId: string, callback: (data: Team) => void) {
	const unsubscribe = await subscribeToDocument(FirestoreCollections.TEAMS, teamId, callback)
	return unsubscribe
}
