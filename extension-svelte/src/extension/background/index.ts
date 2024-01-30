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
	sendActivityApply,
	saveProjectStream
} from '$lib/utils/messaging'
import { toggleProjectTab } from '$lib/visbug/visbug'
import {
	authUserBucket,
	getActiveProject,
	getActiveUser,
	InjectState,
	projectsMapBucket,
	teamsMapBucket,
	userBucket,
	usersMapBucket,
	tabsMapBucket,
	type VisbugState,
	saveTabState,
	getTabState
} from '$lib/utils/localstorage'
import { signInUser, subscribeToFirebaseAuthChanges } from '$lib/firebase/auth'

import type { Team } from '$shared/models/team'
import type { Activity, StyleChange } from '$shared/models/activity'
import type { Comment } from '$shared/models/comment'

import { subscribeToUser } from '$lib/storage/user'
import { subscribeToTeam } from '$lib/storage/team'
import { postProjectToFirebase, subscribeToProject } from '$lib/storage/project'
import { sameTabHost, updateProjectTabHostWithDebounce } from './tabs'
import { nanoid } from 'nanoid'
import type { Project } from '$shared/models/project'
import { convertVisbugToStyleChangeMap } from '$shared/helpers'

let projectSubs: (() => void)[] = []
let teamSubs: (() => void)[] = []
let userSubs: (() => void)[] = []

function setDefaultMaps() {
	teamsMapBucket.set({})
	projectsMapBucket.set({})
	usersMapBucket.set({})
	tabsMapBucket.set({})
}

const updateTabActiveState = (tab: chrome.tabs.Tab, project: Project, enable: boolean) => {
	updateProjectTabHostWithDebounce(tab)
	toggleProjectTab(tab.id as number, project.id, enable)

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
		const activeTab = tabs[0]
		if (!activeTab) return
		const project = await getActiveProject()

		// If active tab is not project tab
		if (!sameTabHost(activeTab.url ?? '', project.hostUrl)) return

		let tabState: VisbugState = await getTabState(activeTab.id as number)

		// If tab is not injected, inject it
		if (tabState.state !== InjectState.injected) {
			toggleProjectTab(activeTab.id as number, project.id, true)
		}

		// Forward to callback
		callback(detail, {
			tabId: activeTab.id
		})
	})
}

const setListeners = () => {
	// Refresh tabs on update
	chrome.runtime.onInstalled.addListener(async () => {
		setDefaultMaps()
		for (const cs of chrome.runtime.getManifest().content_scripts ?? []) {
			for (const tab of await chrome.tabs.query({ url: cs.matches })) {
				chrome.scripting.executeScript({
					target: { tabId: tab.id as number },
					files: cs.js ?? []
				})
			}
		}
	})

	chrome.tabs.onUpdated.addListener(
		async (tabId: number, changeInfo: chrome.tabs.TabChangeInfo) => {
			// Remove tab info from state when it's refreshed
			if (changeInfo.status === 'complete') {
				saveTabState(tabId, {
					projectId: '',
					state: InjectState.none
				})
			}
		}
	)

	chrome.tabs.onRemoved.addListener((tabId: number) => {
		// Remove tab info from state when it's refreshed
		saveTabState(tabId, {
			projectId: '',
			state: InjectState.none
		})
	})

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

	saveProjectStream.subscribe(async ([project, sender]) => {
		postProjectToFirebase(project)
		projectsMapBucket.set({ [project.id]: project })
	})

	// Start editing request from popip
	editProjectRequestStream.subscribe(([{ project, enable }]) => {
		// Get tab if same host using pattern matching
		const searchUrl = new URL(project.hostUrl).origin + '/*'

		chrome.tabs.query({ url: searchUrl }, tabs => {
			// Check if tab with same url exists
			if (tabs?.length) {
				// Make sure tab is active
				if (enable) chrome.tabs.update(tabs[0].id as number, { active: true })
				updateTabActiveState(tabs[0], project, enable)
			} else {
				// If tab doesn't exist and command is disable, do nothing
				if (!enable) return
				chrome.tabs
					.create({
						url: project.hostUrl
					})
					.then((tab: chrome.tabs.Tab) => {
						updateTabActiveState(tab, project, enable)
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
		const teamsNotInMap = user.teamIds.filter(teamId => !mappedTeamIds.includes(teamId))

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
				createdAt: new Date().toISOString(),
				selector: visbugStyleChange.selector,
				// TODO: save path to file
				path: visbugStyleChange.path,
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

		activity.path = visbugStyleChange.path ?? activity.path
		activity.createdAt = new Date().toISOString()
		activeProject.activities[visbugStyleChange.selector] = activity

		// Update project
		projectsMapBucket.set({ [activeProject.id]: activeProject })
	})
}

try {
	setListeners()
	console.log('Background script loaded!')
} catch (error) {
	console.error(error)
}
