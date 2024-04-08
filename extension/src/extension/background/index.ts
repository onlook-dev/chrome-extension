import { DashboardRoutes, FirestoreCollections } from '$shared/constants'
import { baseUrl } from '$lib/utils/env'
import {
	activityRevertStream,
	authRequestStream,
	editProjectRequestStream,
	openUrlRequestStream,
	sendActivityRevert,
	editEventStream,
	activityApplyStream,
	sendActivityApply,
	saveProjectStream
} from '$lib/utils/messaging'
import {
	authUserBucket,
	getActiveProject,
	InjectState,
	projectsMapBucket,
	teamsMapBucket,
	userBucket,
	usersMapBucket,
	tabsMapBucket,
	saveTabState,
	getTabState,
	getProjectById,
	removeProjectFromTabs,
	popupStateBucket
} from '$lib/utils/localstorage'
import { signInUser, subscribeToFirebaseAuthChanges } from '$lib/firebase/auth'
import { forwardToActiveProjectTab, updateTabActiveState } from './tabs'

import type { Team } from '$shared/models/team'
import type { Activity } from '$shared/models/activity'
import type { Comment } from '$shared/models/comment'
import { FirebaseService } from '$lib/storage'
import type { Project } from '$shared/models/project'
import type { User } from '$shared/models/user'
import { EditEventService } from '$lib/editEvents'
import { initializeMixpanel } from '$lib/mixpanel'

let projectSubs: (() => void)[] = []
let teamSubs: (() => void)[] = []
let userSubs: (() => void)[] = []
let activeProjectSub: (() => void) | null = null

const projectService = new FirebaseService<Project>(FirestoreCollections.PROJECTS)
const teamService = new FirebaseService<Team>(FirestoreCollections.TEAMS)
const userService = new FirebaseService<User>(FirestoreCollections.USERS)
const editEventService = new EditEventService(forwardToActiveProjectTab)

function setDefaultMaps() {
	teamsMapBucket.set({})
	projectsMapBucket.set({})
	usersMapBucket.set({})
	tabsMapBucket.set({})
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
		async (tabId: number, changeInfo: chrome.tabs.TabChangeInfo, tab: chrome.tabs.Tab) => {
			// Remove tab info from state when it's refreshed
			if (changeInfo.status === 'complete') {
				const tabState = await getTabState(tabId)
				if (tabState.state === InjectState.injected) {
					// If tab should be injected, reinject it
					saveTabState(tabId, {
						projectId: '',
						state: InjectState.none
					}).then(() => {
						return getProjectById(tabState.projectId)
					}).then(project => {
						updateTabActiveState(tab, project, true)
					})
				} else {
					saveTabState(tabId, {
						projectId: '',
						state: InjectState.none
					})
				}
			}
		}
	)

	chrome.tabs.onRemoved.addListener((tabId: number) => {
		// If tab includes active project, save its state
		getTabState(tabId).then(tabState => {
			if (!tabState) return
			getActiveProject().then(activeProject => {
				if (!activeProject) return
				if (tabState.projectId == activeProject.id) projectService.post(activeProject)
			})
		})
		saveTabState(tabId, {
			projectId: '',
			state: InjectState.none
		})
	})

	subscribeToFirebaseAuthChanges()

	// Forward messages to content script
	activityRevertStream.subscribe(([detail, sender]) => {
		forwardToActiveProjectTab(detail, sendActivityRevert)
	})

	// Forward messages to content script
	activityApplyStream.subscribe(([detail, sender]) => {
		forwardToActiveProjectTab(detail, sendActivityApply)
	})

	// Auth request from popup
	authRequestStream.subscribe(() => {
		const authUrl = `${baseUrl}${DashboardRoutes.SIGNIN}`
		chrome.tabs.create({ url: authUrl })
		return
	})

	saveProjectStream.subscribe(([project, sender]) => {
		projectService.post(project)
		projectsMapBucket.set({ [project.id]: project })
	})

	// Start editing request from popup
	editProjectRequestStream.subscribe(([{ project, enable }]) => {
		// Get tab if same host using pattern matching
		const searchUrl = new URL(project.hostUrl).origin + '/*'

		chrome.tabs.query({ url: searchUrl }, tabs => {
			// Check if tab with same url exists
			if (tabs?.length) {
				// If tab exists and command is enable, also make it active
				for (let i = 0; i < tabs.length; i++) {
					// Make first tab active
					if (enable && i === 0) {
						chrome.tabs.update(tabs[i].id as number, { active: true })
					}
					updateTabActiveState(tabs[i], project, enable)
				}
			} else {
				if (enable) {
					// If tab doesn't exist and command is enable, create tab
					chrome.tabs
						.create({
							url: project.hostUrl
						})
						.then((tab: chrome.tabs.Tab) => {
							updateTabActiveState(tab, project, enable)
						})
				} else {
					// If tabs don't exist and command is disable, remove instances of project
					removeProjectFromTabs(project.id)
				}
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
			teamService.subscribe(teamId, async team => {
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
			projectService.subscribe(projectId, async project => {
				if (!project) return
				projectsMapBucket.set({ [project.id]: project })
			}).then(unsubscribe => {
				projectSubs.push(unsubscribe)
			})
		}
	})

	// Project changes in map
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
			userService.subscribe(userId, async user => {
				if (!user) return
				usersMapBucket.set({ [user.id]: user })
			}).then(unsubscribe => {
				userSubs.push(unsubscribe)
			})
		}
	})

	// Listen for active project changing
	popupStateBucket.valueStream.subscribe(async ({ activeProjectId }) => {
		if (!activeProjectId) return
		if (activeProjectSub) {
			activeProjectSub()
			activeProjectSub = null
		}

		projectService.subscribe(activeProjectId, async project => {
			if (!project) return
			projectsMapBucket.set({ [project.id]: project })
		}).then(unsubscribe => {
			activeProjectSub = unsubscribe
		})
	})

	// Open url from popup
	openUrlRequestStream.subscribe(([url, sender]) => {
		chrome.tabs.create({ url: url })
	})

	// Style change from visbug and content script
	editEventStream.subscribe(([editEvent]) => {
		editEventService.handleEditEvent(editEvent)
	})
}

try {
	setListeners()
	initializeMixpanel()
} catch (error) {
	console.error(error)
}
