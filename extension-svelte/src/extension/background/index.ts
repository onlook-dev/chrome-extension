import { DASHBOARD_AUTH_ROUTE, DASHBOARD_URL } from '../../lib/utils/constants'
import { authRequestStream, toggleVisbugStream } from '$lib/utils/messaging'
import { toggleIn } from '$lib/visbug/visbug'
import {
	authUserBucket,
	projectsMapBucket,
	teamsMapBucket,
	userBucket
} from '$lib/utils/localstorage'
import { signInUser, subscribeToFirebaseAuthChanges } from '$lib/firebase/auth'
import { getTeamFromFirebase } from '$lib/storage/team'
import { getProjectFromFirebase } from '$lib/storage/project'
import type { Team } from '$models/team'
import type { Project } from '$models/project'

// When triggered, open tab or use existin project tab and toggle visbug in

const setListeners = () => {
	subscribeToFirebaseAuthChanges()

	toggleVisbugStream.subscribe(() => {
		toggleVisbugOnActiveTab()
	})

	authRequestStream.subscribe(() => {
		const authUrl = `${DASHBOARD_URL}/${DASHBOARD_AUTH_ROUTE}`
		chrome.tabs.create({ url: authUrl })
		return
	})

	authUserBucket.valueStream.subscribe(({ authUser }) => {
		if (authUser) {
			signInUser(authUser)
		}
	})

	userBucket.valueStream.subscribe(({ user }) => {
		if (!user) return
		// When user added, get teams and add to map if not already there
		teamsMapBucket.getKeys().then(mappedTeamIds => {
			const teamsNotInMap = user.teams.filter(teamId => !mappedTeamIds.includes(teamId))
			teamsNotInMap.forEach(teamId => {
				getTeamFromFirebase(teamId).then(team => {
					if (!team) return
					teamsMapBucket.set({ [team.id]: team })
				})
			})
		})
	})

	teamsMapBucket.valueStream.subscribe(teamsMap => {
		if (!teamsMap) return

		// When teams are added, get projects and add to map if not already there
		projectsMapBucket.getKeys().then(mappedProjectIds => {
			const projectsNotInMap: string[] = Object.values(teamsMap)
				.flatMap((team: Team) => team.projectIds)
				.filter((projectId: string) => !mappedProjectIds.includes(projectId))

			projectsNotInMap.forEach(projectId => {
				getProjectFromFirebase(projectId).then((project: Project | undefined) => {
					if (!project) return
					projectsMapBucket.set({ [project.id]: project })
				})
			})
		})
	})
}

function toggleVisbugOnActiveTab() {
	chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
		toggleIn({ id: tabs[0].id })
	})
}

try {
	setListeners()
	console.log('Background script loaded!')
} catch (error) {
	console.error(error)
}
