import { DASHBOARD_AUTH_ROUTE, DASHBOARD_URL } from '../../lib/utils/constants'
import {
	authRequestStream,
	editProjectRequestStream,
	toggleVisbugStream
} from '$lib/utils/messaging'
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

	editProjectRequestStream.subscribe(([project]) => {
		// Get tab if same host using pattern matching
		const searchUrl = new URL(project.hostUrl).origin + '/*'

		chrome.tabs.query({ url: searchUrl }, tabs => {
			// Check if tab with same url exists
			if (tabs?.length) {
				// Make sure tab is active
				chrome.tabs.update(tabs[0].id as number, { active: true })
				toggleIn({ id: tabs[0].id })
				return
			} else {
				chrome.tabs
					.create({
						url: project.hostUrl
					})
					.then(tab => {
						toggleIn({ id: tab.id })
					})
				return
			}
		})

		return
	})

	authUserBucket.valueStream.subscribe(({ authUser }) => {
		if (authUser) {
			signInUser(authUser)
		}
	})

	userBucket.valueStream.subscribe(async ({ user }) => {
		if (!user) return
		// When user added, get teams and add to map if not already there
		const mappedTeamIds = await teamsMapBucket.getKeys()
		const teamsNotInMap = user.teams.filter(teamId => !mappedTeamIds.includes(teamId))
		for (const teamId of teamsNotInMap) {
			const team = await getTeamFromFirebase(teamId)
			if (!team) return
			teamsMapBucket.set({ [team.id]: team })
		}
	})

	teamsMapBucket.valueStream.subscribe(async teamsMap => {
		if (!teamsMap) return

		// When teams are added, get projects and add to map if not already there
		const mappedProjectIds = await projectsMapBucket.getKeys()
		const projectsNotInMap: string[] = Object.values(teamsMap)
			.flatMap((team: Team) => team.projectIds)
			.filter((projectId: string) => !mappedProjectIds.includes(projectId))

		for (const projectId of projectsNotInMap) {
			const project = await getProjectFromFirebase(projectId)
			if (!project) return
			projectsMapBucket.set({ [project.id]: project })
		}
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
