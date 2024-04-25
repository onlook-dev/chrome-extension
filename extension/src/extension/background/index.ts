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
	saveProjectStream,
	sendPageScreenshotResponse,
	pageScreenshotRequestStream
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
	popupStateBucket,
	getActiveUser
} from '$lib/utils/localstorage'
import { signInUser, subscribeToFirebaseAuthChanges } from '$lib/firebase/auth'
import { forwardToActiveProjectTab, updateTabActiveState } from './tabs'
import { EditEventService } from '$lib/editEvents'
import { initializeMixpanel, trackEvent } from '$lib/mixpanel'
import { FirebaseService } from '$lib/storage'
import { captureActiveTab } from './screenshot'

import type { Team } from '$shared/models/team'
import type { Activity } from '$shared/models/activity'
import type { Comment } from '$shared/models/comment'
import type { User } from '$shared/models/user'
import { FirebaseProjectService } from '$lib/storage/project'
import { toggleProjectTab } from '$lib/editor'
import { ProjectTabManager } from '$lib/project'

let projectSubs: (() => void)[] = []
let teamSubs: (() => void)[] = []
let userSubs: (() => void)[] = []
let activeProjectSub: (() => void) | null = null

const projectService = new FirebaseProjectService()
const teamService = new FirebaseService<Team>(FirestoreCollections.TEAMS)
const userService = new FirebaseService<User>(FirestoreCollections.USERS)
const editEventService = new EditEventService(projectService, forwardToActiveProjectTab)
const projectTabManager = new ProjectTabManager()

function setDefaultMaps() {
	teamsMapBucket.set({})
	projectsMapBucket.set({})
	usersMapBucket.set({})
	tabsMapBucket.set({})
}

async function setStartupState() {
	for (const cs of chrome.runtime.getManifest().content_scripts ?? []) {
		for (const tab of await chrome.tabs.query({ url: cs.matches })) {
			if (tab.url && tab.url.match(/(chrome|chrome-extension):\/\//gi)) continue;
			if (tab.id === undefined) continue

			chrome.scripting.executeScript({
				target: { tabId: tab.id, allFrames: cs.all_frames },
				files: cs.js ?? [],
				injectImmediately: cs.run_at === 'document_start',
			})
		}
	}
}
const setListeners = () => {
	// Refresh tabs on update
	chrome.runtime.onInstalled.addListener(() => {
		setDefaultMaps()
		setStartupState()
	})

	chrome.runtime.onStartup.addListener(setStartupState)

	chrome.action.onClicked.addListener((tab) => {
		getActiveUser().then(user => {
			if (!user) {
				const authUrl = `${baseUrl}${DashboardRoutes.SIGNIN}`
				chrome.tabs.create({ url: authUrl })
				return
			} else {
				if (!tab.url) {
					console.error('Tab URL not found')
					return
				}
				if (tab.url.startsWith('chrome://') || tab.url.includes('chrome.google.com/webstore')) {
					console.error('Cannot inject on chrome pages')
					chrome.action.setBadgeText({ text: 'X', tabId: tab.id });
					chrome.action.setBadgeBackgroundColor({ color: '#FF0000', tabId: tab.id });
					// TODO: Open welcome page or dashboard instead?
					return
				}
				// Inject tab
				projectTabManager.toggleTab(tab, '')
			}
		})
	})

	chrome.tabs.onUpdated.addListener(
		async (tabId: number, changeInfo: chrome.tabs.TabChangeInfo) => {
			if (changeInfo.status === 'complete') {
				projectTabManager.handleTabRefreshed(tabId)
			}
		}
	)

	chrome.tabs.onRemoved.addListener((tabId: number) => {
		projectTabManager.removeTabState(tabId)
	})

	subscribeToFirebaseAuthChanges()

	// Forward messages to content script
	activityRevertStream.subscribe(([detail]) => {
		forwardToActiveProjectTab(detail, sendActivityRevert)
	})

	// Forward messages to content script
	activityApplyStream.subscribe(([detail]) => {
		forwardToActiveProjectTab(detail, sendActivityApply)
	})

	// Auth request from popup
	authRequestStream.subscribe(() => {
		const authUrl = `${baseUrl}${DashboardRoutes.SIGNIN}`
		chrome.tabs.create({ url: authUrl })
		return
	})

	saveProjectStream.subscribe(([project]) => {
		projectService.post(project)
		projectsMapBucket.set({ [project.id]: project })
	})

	pageScreenshotRequestStream.subscribe(async ([{ signature, refresh }]) => {
		// Send message back
		const image = await captureActiveTab(refresh)
		forwardToActiveProjectTab({ image, signature }, sendPageScreenshotResponse)
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
		// Check if URL already exists in a tab, if so open that tab instead
		chrome.tabs.query({ url }, tabs => {
			if (tabs.length) {
				chrome.tabs.update(tabs[0].id as number, { active: true })
			} else {
				chrome.tabs.create({ url })
			}
		})
	})

	// Style change from visbug and content script
	editEventStream.subscribe(([editEvent]) => {
		editEventService.handleEditEvent(editEvent)
		trackEvent('Edit Event', { type: editEvent.editType })
	})
}

try {
	setListeners()
	initializeMixpanel()
} catch (error) {
	console.error(error)
}

// Keep service worker alive
const keepAlive = () => setInterval(chrome.runtime.getPlatformInfo, 20e3);
chrome.runtime.onStartup.addListener(keepAlive);
keepAlive();