import { getActiveUser, getProjectById, projectsMapBucket } from "$lib/utils/localstorage";
import { LengthSettings } from "$shared/constants";
import { MessageType } from "$shared/message";
import type { HostData, Project } from "$shared/models";
import { ProjectStatus } from "$shared/models";
import { getBucket } from "@extend-chrome/storage";
import { nanoid } from "nanoid";
import { sendMessage } from "webext-bridge/background";

const tabProjectIdBucket = getBucket<{ [tabId: string]: string }>('TABS_PROJECT_ID_MAP')
const tabStateBucket = getBucket<{ [tabId: string]: TabState }>('TABS_STATE_MAP')

export enum TabState {
    injected = "injected",
    ejected = "ejected",
    none = "none"
}

// @ts-ignore - browser exists
var platform = typeof browser === 'undefined' ? chrome : browser

export class ProjectTabService {
    injectTab = (tabId: number) => {
        platform.scripting.executeScript({
            target: { tabId: tabId },
            files: ['src/lib/editor/inject.js']
        }).then(() => {
            // Just in case tab was already injected. Can happen in navigation. 
            // This could cause bugs in the future if we extend restore functionalities. Best way to do this rn.
            this.restoreTab(tabId)
        })
        this.setTabState(tabId, TabState.injected)
    }

    ejectTab = (tabId: number) => {
        platform.scripting.executeScript({
            target: { tabId: tabId },
            files: ['src/lib/editor/eject.js']
        })
        this.setTabState(tabId, TabState.ejected)
    }

    restoreTab = (tabId: number) => {
        platform.scripting.executeScript({
            target: { tabId: tabId },
            files: ['src/lib/editor/restore.js']
        })
        this.setTabState(tabId, TabState.injected)
    }

    toggleTab = async (tab: chrome.tabs.Tab, inject?: boolean) => {
        if (!tab.id) throw new Error("Tab id not found");
        const tabState = await this.getTabState(tab.id)

        // Default to toggling state
        if (inject === undefined) {
            inject = !(tabState === TabState.injected)
        }

        if (inject) {
            if (tabState === TabState.ejected) {
                this.restoreTab(tab.id)
            } else if (tabState === TabState.none) {
                this.injectTab(tab.id)
            }
        } else {
            this.ejectTab(tab.id)
        }
    }

    removeProject = (project: Project): Promise<void> => {
        // Remove project from any existing tab
        const tabMaps = tabProjectIdBucket.get()
        Object.entries(tabMaps).forEach(async ([tabId, projectId]) => {
            if (projectId === project.id) {
                await tabProjectIdBucket.remove(tabId)
            }
        })
        return projectsMapBucket.remove(project.id ?? '')
    }

    setTabProject = async (tab: chrome.tabs.Tab, project: Project): Promise<void> => {
        if (!tab.id) throw new Error("Tab id not found");
        await tabProjectIdBucket.set({ [tab.id]: project.id })
        await projectsMapBucket.set({ [project.id]: project })
    }

    async getTabProject(tab: chrome.tabs.Tab): Promise<Project> {
        const tabProjectMap = await tabProjectIdBucket.get()
        if (!tab.id) throw new Error("Tab id not found");

        let projectId = tabProjectMap[tab.id];
        if (!projectId) {
            const newProject = await this.createNewProject(tab);
            projectId = newProject.id;
            // Save new project in maps
            await tabProjectIdBucket.set({ [tab.id]: newProject.id })
            await projectsMapBucket.set({ [newProject.id]: newProject })
        }
        return getProjectById(projectId);
    }

    getDefaultname(url: string | undefined): string {
        if (!url) return "New Project";
        try {
            const urlObj = new URL(url);
            // Capitalize and make readable name
            return urlObj.hostname.replace("www.", "").replace(/\./g, " ").replace(/\b\w/g, l => l.toUpperCase());
        } catch (e) {
            return url;
        }
    }

    async createNewProject(tab: chrome.tabs.Tab): Promise<Project> {
        // Get name and host from tab info
        let projectName = tab.title || this.getDefaultname(tab.url);

        // Cut project name down 
        if (projectName.length > LengthSettings.MAX_TITLE_LENGTH) {
            projectName = projectName.slice(0, LengthSettings.MAX_TITLE_LENGTH)
        }

        const user = await getActiveUser();
        if (!user) throw new Error("No user found");

        const teamsIds = user?.teamIds || [];
        if (!teamsIds.length) throw new Error("No teams found");

        const projectUrl = tab.url
        const newProject = {
            id: nanoid(),
            name: projectName,
            teamId: teamsIds[0],
            hostUrl: projectUrl,
            activities: {},
            comments: [],
            hostData: { favicon: tab.favIconUrl } as HostData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            githubHistoryIds: [],
            status: ProjectStatus.DRAFT
        } as Project
        return newProject;
    }

    async getTabState(tabId: number): Promise<TabState> {
        const stateMap = await tabStateBucket.get();
        return stateMap[tabId] || TabState.none;
    }

    async setTabState(tabId: number, state: TabState) {
        tabStateBucket.set({ [tabId]: state })
    }

    handleTabRefreshed = async (tab: chrome.tabs.Tab) => {
        const tabState = await this.getTabState(tab.id as number)
        if (tabState === TabState.injected) {
            // Re-inject
            this.injectTab(tab.id as number)
            const project = await this.getTabProject(tab)
            sendMessage(MessageType.APPLY_PROJECT_CHANGE, project as any, `window@${tab.id}`)
        } else {
            this.setTabState(tab.id as number, TabState.none)
        }
    }

    removeTabState(tabId: number) {
        tabStateBucket.remove(tabId.toString())
    }
}