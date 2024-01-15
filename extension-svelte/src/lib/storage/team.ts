import {
	getObjectFromCollection,
	postObjectToCollection,
	subscribeToDocument
} from '$lib/firebase/firestore'
import { FIREBASE_COLLECTION_TEAMS } from '$shared/constants'
import type { Team } from '../../../../shared/models/team'

export async function getTeamFromFirebase(teamId: string): Promise<Team> {
	const teamData = await getObjectFromCollection(FIREBASE_COLLECTION_TEAMS, teamId)
	return teamData as Team
}

export async function postTeamToFirebase(team: Team): Promise<string | undefined> {
	console.log('Posting firebase team')
	const objectId = await postObjectToCollection(FIREBASE_COLLECTION_TEAMS, team, team.id)
	console.log('Posted firebase team with ID', objectId)
	return objectId
}

export async function subscribeToTeam(teamId: string, callback: (data: Team) => void) {
	const unsubscribe = await subscribeToDocument(FIREBASE_COLLECTION_TEAMS, teamId, callback)
	return unsubscribe
}
