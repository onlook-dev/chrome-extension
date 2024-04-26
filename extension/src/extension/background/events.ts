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
    projectsMapBucket,
    teamsMapBucket,
    usersMapBucket,
    tabsMapBucket,
    removeProjectFromTabs,
    getActiveUser
} from '$lib/utils/localstorage'
import { signInUser, subscribeToFirebaseAuthChanges } from '$lib/firebase/auth'
import { forwardToActiveProjectTab, updateTabActiveState } from './tabs'
import { captureActiveTab } from './screenshot'
import { EditEventService } from '$lib/editEvents'
import { trackEvent } from '$lib/mixpanel'
import { FirebaseService } from '$lib/storage'
import { FirebaseProjectService } from '$lib/storage/project'
import { ProjectTabManager } from '$lib/tabs'
import { EntitySubsciptionService } from './entities'

import type { Team, User } from '$shared/models'

export class BackgroundEventHandlers {
    projectService: FirebaseProjectService
    teamService: FirebaseService<Team>
    userService: FirebaseService<User>
    editEventService: EditEventService
    projectTabManager: ProjectTabManager
    entitiesService: EntitySubsciptionService

    constructor() {
        this.projectService = new FirebaseProjectService()
        this.teamService = new FirebaseService<Team>(FirestoreCollections.TEAMS)
        this.userService = new FirebaseService<User>(FirestoreCollections.USERS)
        this.editEventService = new EditEventService(forwardToActiveProjectTab)
        this.projectTabManager = new ProjectTabManager()
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
        tabsMapBucket.set({})
    }

    openOrCreateNewTab(url: string) {
        return chrome.tabs.query({ url }, tabs => {
            if (tabs.length) {
                chrome.tabs.update(tabs[0].id as number, { active: true })
            } else {
                chrome.tabs.create({ url })
            }
        })
    }

    async setStartupState() {
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

    listen = () => {
        subscribeToFirebaseAuthChanges()

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
                if (changeInfo.status == 'complete' && tab.url) {
                    this.projectTabManager.handleTabRefreshed(tabId)
                }
            }
        )

        chrome.tabs.onRemoved.addListener((tabId: number) => {
            this.projectTabManager.removeTabState(tabId)
        })


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
            this.openOrCreateNewTab(`${baseUrl}${DashboardRoutes.SIGNIN}`)
        })

        saveProjectStream.subscribe(([project]) => {
            this.projectService.post(project)
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
            chrome.tabs.query({ url: project.hostUrl }, tabs => {
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

        // Open url from popup
        openUrlRequestStream.subscribe(([url, sender]) => {
            this.openOrCreateNewTab(url)
        })

        // Style change from visbug and content script
        editEventStream.subscribe(([editEvent, sender]) => {
            const tabId = sender.tab?.id
            if (!tabId) {
                console.error('Tab ID not found')
                return
            }
            this.editEventService.handleEditEvent(editEvent, tabId)
            trackEvent('Edit Event', { type: editEvent.editType })
        })
    }

}