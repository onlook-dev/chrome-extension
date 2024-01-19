import { DashboardRoutes } from '$shared/constants'
import { baseUrl } from '$lib/utils/env'
import {
	MessageReceiver,
	activityInspectStream,
	activityRevertStream,
	authRequestStream,
	editProjectRequestStream,
	openUrlRequestStream,
	sendActivityInspect,
	sendApplyProjectChanges,
	sendActivityRevert,
	styleChangeStream,
	activityApplyStream,
	sendActivityApply
} from '$lib/utils/messaging'
import { toggleIn } from '$lib/visbug/visbug'
import {
	authUserBucket,
	getActiveProject,
	getActiveUser,
	projectsMapBucket,
	teamsMapBucket,
	userBucket,
	usersMapBucket,
	visbugStateBucket
} from '$lib/utils/localstorage'
import { signInUser, subscribeToFirebaseAuthChanges } from '$lib/firebase/auth'

import type { Team } from '$shared/models/team'
import type { Activity, StyleChange } from '$shared/models/activity'
import type { Comment } from '$shared/models/comment'

import { subscribeToUser } from '$lib/storage/user'
import { subscribeToTeam } from '$lib/storage/team'
import { subscribeToProject } from '$lib/storage/project'
import { sameTabHost, updateProjectTabHostWithDebounce } from './tabs'
import { nanoid } from 'nanoid'
import type { Project } from '$shared/models/project'
import { convertVisbugToStyleChangeMap } from '$shared/helpers'

let projectSubs: (() => void)[] = []
let teamSubs: (() => void)[] = []
let userSubs: (() => void)[] = []

const setDefaultState = () => {
	visbugStateBucket.set({
		loadedTabs: {},
		injectedTabs: {},
		injectedProjects: {}
	})
}

const makeProjectTabActive = (tab: chrome.tabs.Tab, project: Project) => {
	updateProjectTabHostWithDebounce(tab)
	toggleIn(tab.id as number, project.id)

	// Forward message
	chrome.tabs.sendMessage(tab.id as number, {
		greeting: 'APPLY_PROJECT_CHANGES',
		payload: {
			data: {},
			to: MessageReceiver.CONTENT
		}
	})

	sendApplyProjectChanges(undefined, {
		tabId: tab.id
	})
}

function forwardToActiveProjectTab(detail: any, callback: any) {
	chrome.tabs.query({ active: true, currentWindow: true }, async tabs => {
		// If tab is not active, don't send message
		if (!tabs[0]) return
		const project = await getActiveProject()

		// If active tab is not project tab
		if (!sameTabHost(tabs[0].url ?? '', project.hostUrl)) return

		const visbugState = await visbugStateBucket.get()
		// If tab is not injected, inject it
		if (!visbugState.injectedTabs[tabs[0].id as number]) {
			toggleIn(tabs[0].id as number, project.id)
		}

		callback(detail, {
			tabId: tabs[0].id
		})
	})
}

const setListeners = () => {
	subscribeToFirebaseAuthChanges()

	// Forward messages to content script
	activityInspectStream.subscribe(async ([detail, sender]) => {
		forwardToActiveProjectTab(detail, sendActivityInspect)
	})

	// Forward messages to content script
	activityRevertStream.subscribe(async ([detail, sender]) => {
		forwardToActiveProjectTab(detail, sendActivityRevert)
	})

	// Forward messages to content script
	activityApplyStream.subscribe(async ([detail, sender]) => {
		forwardToActiveProjectTab(detail, sendActivityApply)
	})

	// Auth request from popup
	authRequestStream.subscribe(() => {
		const authUrl = `${baseUrl}${DashboardRoutes.SIGNIN}`
		chrome.tabs.create({ url: authUrl })
		return
	})

	// Start editing request from popip
	editProjectRequestStream.subscribe(([project]) => {
		// Get tab if same host using pattern matching
		const searchUrl = new URL(project.hostUrl).origin + '/*'

		chrome.tabs.query({ url: searchUrl }, tabs => {
			// Check if tab with same url exists
			if (tabs?.length) {
				// Make sure tab is active
				chrome.tabs.update(tabs[0].id as number, { active: true })
				makeProjectTabActive(tabs[0], project)
			} else {
				chrome.tabs
					.create({
						url: project.hostUrl
					})
					.then(tab => {
						makeProjectTabActive(tab, project)
					})
			}
		})
	})

	// Auth user changes from content script
	authUserBucket.valueStream.subscribe(({ authUser }) => {
		if (authUser) {
			signInUser(authUser)
		}
	})

	// User  change from signing in
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

	// Teams bucket change from user change
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

	// Project changes from team
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

	// Open url from popup
	openUrlRequestStream.subscribe(([url, sender]) => {
		chrome.tabs.create({ url: url })
	})

	// Style change from visbug and content script
	styleChangeStream.subscribe(async ([visbugStyleChange]) => {
		const activeProject = await getActiveProject()
		if (!activeProject) return

		let activity = activeProject.activities[visbugStyleChange.selector]

		// Create activity if it doesn't exist
		if (!activity) {
			const user = await getActiveUser()
			activity = {
				id: nanoid(),
				userId: user.id,
				projectId: activeProject.id,
				eventData: [],
				creationTime: new Date().toISOString(),
				selector: visbugStyleChange.selector,
				styleChanges: {},
				visible: true
			} as Activity
		}

		const mappedStyleChange = convertVisbugToStyleChangeMap(visbugStyleChange)

		// For each key in mappedStyleChange,
		// if key does not exist in activity, add the oldVal and newVal.
		// if it does, only apply newVal
		Object.entries(mappedStyleChange).forEach(([key, val]) => {
			if (!activity.styleChanges[key]) {
				activity.styleChanges[key] = {
					key: key,
					oldVal: val.oldVal ?? '',
					newVal: val.newVal
				} as StyleChange
			} else {
				activity.styleChanges[key].newVal = val.newVal
			}
		})

		activity.creationTime = new Date().toISOString()
		activeProject.activities[visbugStyleChange.selector] = activity

		// Update project
		projectsMapBucket.set({ [activeProject.id]: activeProject })
	})
}

try {
	setDefaultState()
	setListeners()
	console.log('Background script loaded!')
} catch (error) {
	console.error(error)
}
