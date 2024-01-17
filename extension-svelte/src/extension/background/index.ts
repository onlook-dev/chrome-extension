import { DashboardRoutes, DASHBOARD_URL } from '$shared/constants'
import {
	MessageReceiver,
	authRequestStream,
	editProjectRequestStream,
	styleChangeStream,
	toggleVisbugStream
} from '$lib/utils/messaging'
import { toggleIn, visbugState } from '$lib/visbug/visbug'
import {
	authUserBucket,
	getActiveProject,
	getActiveUser,
	projectsMapBucket,
	teamsMapBucket,
	userBucket,
	usersMapBucket
} from '$lib/utils/localstorage'
import { signInUser, subscribeToFirebaseAuthChanges } from '$lib/firebase/auth'

import type { Team } from '$shared/models/team'
import type { Activity, StyleChange } from '$shared/models/activity'
import type { Comment } from '$shared/models/comment'

import { subscribeToUser } from '$lib/storage/user'
import { subscribeToTeam } from '$lib/storage/team'
import { subscribeToProject } from '$lib/storage/project'
import { updateProjectTabHostWithDebounce } from './tabs'
import { nanoid } from 'nanoid'

let projectSubs: (() => void)[] = []
let teamSubs: (() => void)[] = []
let userSubs: (() => void)[] = []

const setListeners = () => {
	subscribeToFirebaseAuthChanges()

	chrome.runtime.onMessage.addListener(async (message, sender) => {
		switch (message.payload?.data?.to) {
			case MessageReceiver.CONTENT:
				// Send message to content script of active tab
				chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
					// If tab is not active, don't send message
					if (!tabs[0]) return

					// If tab is not injected, don't send message
					const visbugActiveInTab = visbugState.injected[tabs[0].id as number]

					if (!visbugActiveInTab) {
						toggleIn(tabs[0])
					}
					chrome.tabs.sendMessage(tabs[0].id as number, message)
				})
				break
		}
	})
	toggleVisbugStream.subscribe(() => {
		toggleVisbugOnActiveTab()
	})

	authRequestStream.subscribe(() => {
		const authUrl = `${DASHBOARD_URL}${DashboardRoutes.SIGNIN}`
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
				updateProjectTabHostWithDebounce(tabs[0])
				toggleIn(tabs[0])
				return
			} else {
				chrome.tabs
					.create({
						url: project.hostUrl
					})
					.then(tab => {
						updateProjectTabHostWithDebounce(tab)
						toggleIn(tabs[0])
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

		// Save user in map
		usersMapBucket.set({ [user.id]: user })
		// When user added, get teams and add to map if not already there
		const mappedTeamIds = await teamsMapBucket.getKeys()
		const teamsNotInMap = user.teams.filter(teamId => !mappedTeamIds.includes(teamId))

		// Unsubscribe from previous teams
		teamSubs.forEach(unsubscribe => unsubscribe())

		for (const teamId of teamsNotInMap) {
			subscribeToTeam(teamId, async team => {
				if (!team) return
				teamsMapBucket.set({ [team.id]: team })
			}).then(unsubscribe => {
				teamSubs.push(unsubscribe)
			})
		}
	})

	teamsMapBucket.valueStream.subscribe(async teamsMap => {
		if (!teamsMap) return

		// When teams are added, get projects and add to map if not already there
		const mappedProjectIds = await projectsMapBucket.getKeys()
		const projectsNotInMap: string[] = Object.values(teamsMap)
			.flatMap((team: Team) => team.projectIds)
			.filter((projectId: string) => !mappedProjectIds.includes(projectId))

		// Unsubscribe from previous projects
		projectSubs.forEach(unsubscribe => unsubscribe())

		for (const projectId of projectsNotInMap) {
			subscribeToProject(projectId, async project => {
				if (!project) return
				projectsMapBucket.set({ [project.id]: project })
			}).then(unsubscribe => {
				projectSubs.push(unsubscribe)
			})
		}
	})

	projectsMapBucket.valueStream.subscribe(async projectsMap => {
		if (!projectsMap) return

		// When projects are added, get users and add to map if not already there
		const mappedUserIds = await usersMapBucket.getKeys()

		// Get users from activities and comments
		const usersNotInMap: string[] = Object.values(projectsMap)
			.flatMap(project =>
				Object.values<Activity>(project.activities).map((item: Activity) => item.userId)
			)
			.concat(
				Object.values(projectsMap).flatMap(project =>
					project.comments.map((item: Comment) => item.userId)
				)
			)
			.filter((userId: string) => !mappedUserIds.includes(userId))

		// Unsubscribe from previous users
		userSubs.forEach(unsubscribe => unsubscribe())

		for (const userId of usersNotInMap) {
			subscribeToUser(userId, async user => {
				if (!user) return
				usersMapBucket.set({ [user.id]: user })
			}).then(unsubscribe => {
				userSubs.push(unsubscribe)
			})
		}
	})

	styleChangeStream.subscribe(async ([styleChange]) => {
		const activeProject = await getActiveProject()
		if (!activeProject) return

		let activity = activeProject.activities[styleChange.selector]

		// Create activity if it doesn't exist
		if (!activity) {
			const user = await getActiveUser()
			activity = {
				id: nanoid(),
				userId: user.id,
				projectId: activeProject.id,
				eventData: [],
				creationTime: new Date().toISOString(),
				selector: styleChange.selector,
				styleChanges: {},
				visible: true
			} as Activity
		}

		// Create style change objects and update activity
		for (const [key, value] of Object.entries(styleChange.changeMap)) {
			const styleChange = {
				key: key,
				oldVal: '',
				newVal: value
			} as StyleChange
			activity.styleChanges[key] = styleChange
		}

		activity.creationTime = new Date().toISOString()

		activeProject.activities[styleChange.selector] = activity

		// Update project
		projectsMapBucket.set({ [activeProject.id]: activeProject })
	})
}

function toggleVisbugOnActiveTab() {
	chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
		toggleIn(tabs[0])
	})
}

try {
	setListeners()
	console.log('Background script loaded!')
} catch (error) {
	console.error(error)
}
