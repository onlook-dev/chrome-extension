import { DashboardRoutes, FirestoreCollections } from '$shared/constants'
import { baseUrl } from '$lib/utils/env'
import {
    editProjectRequestStream,
    openUrlRequestStream,
    editEventStream,
    publishProjectStream,
    sendPageScreenshotResponse,
    pageScreenshotRequestStream,
    tabIdRequestStream,
    sendTabIdResponse,
    sendApplyProjectChanges
} from '$lib/utils/messaging'
import {
    authUserBucket,
    projectsMapBucket,
    teamsMapBucket,
    usersMapBucket,
    getActiveUser
} from '$lib/utils/localstorage'
import { signInUser, signOut, subscribeToFirebaseAuthChanges } from '$lib/firebase/auth'
import { captureActiveTab } from './screenshot'
import { EditEventService } from '$lib/editEvents'
import { trackEvent } from '$lib/mixpanel'
import { FirebaseService } from '$lib/storage'
import { FirebaseProjectService } from '$lib/storage/project'
import { ProjectTabService } from '$lib/projects'
import { EntitySubsciptionService } from './entities'

import { ProjectStatus, type Team, type User } from '$shared/models'
import { forwardToActiveTab } from '$lib/utils/helpers'

export class BackgroundEventHandlers {
    projectService: FirebaseProjectService
    teamService: FirebaseService<Team>
    userService: FirebaseService<User>
    editEventService: EditEventService
    projectTabManager: ProjectTabService
    entitiesService: EntitySubsciptionService

    constructor() {
        this.projectTabManager = new ProjectTabService()
        this.projectService = new FirebaseProjectService()
        this.teamService = new FirebaseService<Team>(FirestoreCollections.TEAMS)
        this.userService = new FirebaseService<User>(FirestoreCollections.USERS)
        this.editEventService = new EditEventService(this.projectTabManager)
        this.entitiesService = new EntitySubsciptionService(
            this.projectService,
            this.teamService,
            this.userService
        )
    }

    setDefaultMaps() {
        teamsMapBucket.set({})
        projectsMapBucket.set({})
        usersMapBucket.set({})
    }

    openOrCreateNewTab(url: string): Promise<chrome.tabs.Tab | undefined> {
        // Normalize the URL by adding a slash if it doesn't end with one and doesn't have a query or fragment
        const hasQueryOrFragment = url.includes('?') || url.includes('#');
        const safeUrl = url + (url.endsWith('/') || hasQueryOrFragment ? '*' : '/*');

        // Create promise to run after callback
        return new Promise((resolve) => {
            // Check if tab is already open
            chrome.tabs.query({ url: safeUrl }, tabs => {
                if (tabs.length) {
                    chrome.tabs.update(tabs[0].id as number, { active: true }, resolve)
                } else {
                    chrome.tabs.create({ url }, resolve)
                }
            })
        })
    }

    async setStartupState() {
        for (const cs of chrome.runtime.getManifest().content_scripts ?? []) {
            const tabs = await chrome.tabs.query({ url: cs.matches })
            for (const tab of tabs) {
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

    listen = () => {
        subscribeToFirebaseAuthChanges()
        this.entitiesService.listen()

        // Refresh tabs on update
        chrome.runtime.onInstalled.addListener(() => {
            this.setDefaultMaps()
            this.setStartupState()
        })

        chrome.runtime.onStartup.addListener(this.setStartupState)

        chrome.action.onClicked.addListener((tab) => {
            getActiveUser().then(user => {
                if (!user) {
                    this.openOrCreateNewTab(`${baseUrl}${DashboardRoutes.SIGNIN}`)
                    if (tab) {
                        this.projectTabManager.toggleTab(tab, false)
                    }
                    return
                } else {
                    if (!tab.url) {
                        // This should never happen
                        console.error("Tab URL not found")
                        return
                    }
                    if (tab.url.startsWith('chrome://') || tab.url.includes('chromewebstore.google.com')) {
                        console.warn('Cannot inject on chrome pages, redirecting to dashboard.')
                        this.openOrCreateNewTab(`${baseUrl}${DashboardRoutes.DASHBOARD}`)
                        return
                    }
                    // Inject tab
                    this.projectTabManager.toggleTab(tab)
                }
            })
        })

        chrome.tabs.onUpdated.addListener(
            async (tabId: number, changeInfo: chrome.tabs.TabChangeInfo, tab: chrome.tabs.Tab) => {
                if (changeInfo.status !== 'complete') return
                this.projectTabManager.handleTabRefreshed(tabId, tab.url)
            }
        )

        chrome.tabs.onRemoved.addListener((tabId: number) => {
            this.projectTabManager.removeTabState(tabId)
        })

        tabIdRequestStream.subscribe(([_, sender]) => {
            forwardToActiveTab(sender.tab, sendTabIdResponse)
        })

        publishProjectStream.subscribe(([project]) => {
            project.status = ProjectStatus.PUBLISHED
            this.projectService.post(project)
            projectsMapBucket.set({ [project.id]: project })
        })

        pageScreenshotRequestStream.subscribe(async ([{ signature, refresh }]) => {
            // Send message back
            const image = await captureActiveTab(refresh)
            forwardToActiveTab({ image, signature }, sendPageScreenshotResponse)
        })

        // Start editing request (from dashboard -> content script -> background)
        editProjectRequestStream.subscribe(async ([{ project, enable }]) => {
            // Add trailing slash if not present
            const hostUrl = project.hostUrl.endsWith('/') ? project.hostUrl : `${project.hostUrl}/`
            const tab = await this.openOrCreateNewTab(hostUrl)
            if (!tab) {
                console.error('Tab not found')
                return
            }
            await this.projectTabManager.setTabProject(tab, project)
            await this.projectTabManager.toggleTab(tab, enable)

            // Forward message after a delay to ensure content script is loaded
            setTimeout(() => {
                forwardToActiveTab({}, sendApplyProjectChanges)
            }, 500)
        })

        // Auth user changes from content script
        authUserBucket.valueStream.subscribe(({ authUser }) => {
            if (authUser) {
                signInUser(authUser)
            } else {
                signOut()
            }
        })

        // Open url 
        openUrlRequestStream.subscribe(([url, sender]) => {
            this.openOrCreateNewTab(url)
        })

        // Style change from (editor -> content script -> background)
        editEventStream.subscribe(([editEvent, sender]) => {
            const tab = sender.tab
            if (!tab) {
                console.error('Tab ID not found')
                return
            }
            this.editEventService.handleEditEvent(editEvent, tab)
            trackEvent('Edit Event', { type: editEvent.editType })
        })
    }

}