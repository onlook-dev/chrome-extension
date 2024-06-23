import { EditEventService } from '$lib/editEvents'
import { signInUser, signOut, subscribeToFirebaseAuthChanges } from '$lib/firebase/auth'
import { trackMixpanelEvent } from '$lib/mixpanel'
import { ProjectTabService } from '$lib/projects'
import { FirebaseService } from '$lib/storage'
import { FirebaseProjectService } from '$lib/storage/project'
import { TranslationService } from '$lib/translation'
import { baseUrl } from '$lib/utils/env'
import {
    authUserBucket,
    getActiveUser,
    projectsMapBucket,
    stateBucket,
    teamsMapBucket,
    usersMapBucket
} from '$lib/utils/localstorage'
import { DashboardRoutes, FirestoreCollections } from '$shared/constants'
import { MessageType } from '$shared/message'
import { ProjectStatus, type EditEvent, type Project, type Team, type User } from '$shared/models'
import { onMessage, sendMessage } from 'webext-bridge/background'
import { EntitySubsciptionService } from './entities'
import { captureActiveTab } from './screenshot'

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
                this.projectTabManager.handleTabRefreshed(tab)
            }
        )

        chrome.tabs.onRemoved.addListener((tabId: number) => {
            this.projectTabManager.removeTabState(tabId)
        })

        onMessage(MessageType.OPEN_URL, async ({ data }) => {
            const { url, inject } = data as { url: string, inject: boolean }
            this.openOrCreateNewTab(url, inject)
        })

        onMessage(MessageType.DASHBOARD_SIGN_IN, ({ data }) => {
            if (data)
                authUserBucket.set({ authUser: data as any })
        })

        onMessage(MessageType.DASHBOARD_SIGN_OUT, ({ }) => {
            authUserBucket.clear()
        })

        // React to authUser changes
        authUserBucket.valueStream.subscribe(({ authUser }) => {
            if (authUser) {
                signInUser(authUser)
            } else {
                signOut()
            }
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
            const tab = await chrome.tabs.get(sender.tabId)
            this.projectTabManager.toggleTab(tab)
        })

        onMessage(MessageType.PUBLISH_PROJECT, async ({ data, sender }) => {
            try {
                const open = data as boolean
                const tab = await chrome.tabs.get(sender.tabId)
                const project = await this.projectTabManager.getTabProject(tab)
                project.status = ProjectStatus.PUBLISHED
                this.projectService.post(project)
                projectsMapBucket.set({ [project.id]: project })
                if (open)
                    this.openOrCreateNewTab(`${baseUrl}${DashboardRoutes.PROJECTS}/${project.id}`)
                trackMixpanelEvent('Publishing project from editor', { projectId: project.id, projectName: project.name, projectUrl: project.hostUrl })
            } catch (error) {
                console.error('Error publishing project', error)
                return false
            }
            return true
        })

        onMessage(MessageType.GET_PAGE_SCREENSHOT, async ({ data }: any) => {
            const { signature, refresh } = data as { signature: string, refresh: boolean }
            const image = await captureActiveTab(refresh)
            return { image, signature }
        })

        onMessage(MessageType.EDIT_PROJECT, async ({ data }: any) => {
            const { project, enable } = data as { project: Project, enable: boolean }
            const tab = await this.openOrCreateNewTab(project.hostUrl)
            if (!tab) {
                console.error('Tab not found')
                return
            }
            await this.projectTabManager.setTabProject(tab, project)
            await this.projectTabManager.toggleTab(tab, enable);

            // Send apply project change to editor tab
            sendMessage(MessageType.APPLY_PROJECT_CHANGE, project as any, `window@${tab.id}`)
        })

        onMessage(MessageType.EDIT_EVENT, async ({ data, sender }: any) => {
            const tab = await chrome.tabs.get(sender.tabId)
            const event = data as EditEvent
            if (!tab) {
                console.error('Tab ID not found')
                return
            }
            this.editEventService.handleEditEvent(event, tab)
            trackMixpanelEvent('Edit event on editor', { type: event.editType, source: event.source })
        })

        onMessage(MessageType.GET_PROJECT, async ({ sender }) => {
            const tab = await chrome.tabs.get(sender.tabId)
            const project = await this.projectTabManager.getTabProject(tab)
            return project
        })

        onMessage(MessageType.GET_PROJECTS, async ({ sender }) => {
            const tab = await chrome.tabs.get(sender.tabId)
            let projects = []

            if (tab.url) {
                const currentHost = new URL(tab.url).hostname
                const map = await projectsMapBucket.get()
                projects = Object.values(map).filter((project: Project) => {
                    if (!project || !project.hostUrl)
                        return false
                    // Filter for projects with the same URL host
                    const projectHost = new URL(project.hostUrl).hostname
                    return currentHost === projectHost
                })
            }
        })
    }
}