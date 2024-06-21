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
    getActiveUser,
    stateBucket
} from '$lib/utils/localstorage'
import { signInUser, signOut, subscribeToFirebaseAuthChanges } from '$lib/firebase/auth'
import { captureActiveTab } from './screenshot'
import { EditEventService } from '$lib/editEvents'
import { trackMixpanelEvent } from '$lib/mixpanel'
import { FirebaseService } from '$lib/storage'
import { FirebaseProjectService } from '$lib/storage/project'
import { ProjectTabService } from '$lib/projects'
import { EntitySubsciptionService } from './entities'
import { onMessage } from 'webext-bridge/background'
import { ProjectStatus, type Team, type User } from '$shared/models'
import { forwardToActiveTab } from '$lib/utils/helpers'
import { MessageType } from '$shared/message'
import { TranslationService } from '$lib/translation'

export class BackgroundEventHandlers {
    projectService: FirebaseProjectService
    teamService: FirebaseService<Team>
    userService: FirebaseService<User>
    editEventService: EditEventService
    projectTabManager: ProjectTabService
    entitiesService: EntitySubsciptionService
    translationService: TranslationService

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
        this.translationService = new TranslationService()
    }

    setDefaultMaps() {
        teamsMapBucket.set({})
        projectsMapBucket.set({})
        usersMapBucket.set({})
        stateBucket.set({ shouldTour: true })
    }

    openOrCreateNewTab(url: string, inject: boolean = false): Promise<chrome.tabs.Tab | undefined> {
        // Normalize the URL by adding a slash if it doesn't end with one and doesn't have a query or fragment
        const hasQueryOrFragment = url.includes('?') || url.includes('#');
        const safeUrl = url + (url.endsWith('/') || hasQueryOrFragment ? '*' : '/*');

        // Create promise to run after callback
        return new Promise((resolve) => {
            const callback = async (tab: chrome.tabs.Tab | undefined) => {
                if (tab) {
                    if (inject) {
                        await this.projectTabManager.toggleTab(tab, true)
                    }
                }
                resolve(tab)
            }
            // Check if tab is already open
            chrome.tabs.query({ url: safeUrl }, tabs => {
                if (tabs.length) {
                    chrome.tabs.update(tabs[0].id as number, { active: true }, callback)
                } else {
                    chrome.tabs.create({ url }, callback)
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
        chrome.runtime.onInstalled.addListener((details) => {
            this.setDefaultMaps()
            this.setStartupState()

            if (details.reason == "install") {
                // Call a function to handle a first install
                this.openOrCreateNewTab(`${baseUrl}${DashboardRoutes.HOME}`)
            }
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

        // Message directly from editor window
        onMessage(MessageType.SEND_CHAT_MESSAGE, async ({ data }) => {
            const startTime = Date.now()
            const res = await this.translationService.invoke(data as any)
            const latency = Date.now() - startTime
            trackMixpanelEvent('Send chat', { query: (data as any)?.content, latency: `${latency}ms` })
            return res
        })

        onMessage(MessageType.SHOULD_TOUR, async () => {
            const { shouldTour } = await stateBucket.get()
            stateBucket.set({ shouldTour: false })
            return shouldTour
        })

        onMessage(MessageType.TOGGLE_EDITOR, async ({ sender }) => {
            console.log('Toggle editor', sender)
            const tab = await chrome.tabs.get(sender.tabId)
            this.projectTabManager.toggleTab(tab)
        })

        tabIdRequestStream.subscribe(([_, sender]) => {
            forwardToActiveTab(sender.tab, sendTabIdResponse)
        })

        publishProjectStream.subscribe(([project]) => {
            project.status = ProjectStatus.PUBLISHED
            this.projectService.post(project)
            projectsMapBucket.set({ [project.id]: project })
            trackMixpanelEvent('Publishing project from editor', { projectId: project.id, projectName: project.name, projectUrl: project.hostUrl })
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
        openUrlRequestStream.subscribe(([{ url, inject }, sender]) => {
            this.openOrCreateNewTab(url, inject)
        })

        // Style change from (editor -> content script -> background)
        editEventStream.subscribe(([editEvent, sender]) => {
            const tab = sender.tab
            if (!tab) {
                console.error('Tab ID not found')
                return
            }
            this.editEventService.handleEditEvent(editEvent, tab)
            trackMixpanelEvent('Edit event on editor', { type: editEvent.editType, source: editEvent.source })
        })
    }
}