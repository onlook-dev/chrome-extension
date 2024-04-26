import { MAX_TITLE_LENGTH } from "$shared/constants";
import type { HostData } from "$shared/models/hostData";
import type { Project } from "$shared/models/project";
import { getBucket } from "@extend-chrome/storage";
import { nanoid } from "nanoid";

const projectTabsBucket = getBucket<{ [tabId: string]: Project }>('PROJECT_TABS_MAP')
const tabStateStore = getBucket<{ [tabId: string]: TabState }>('TABS_STATE_MAP')

export enum TabState {
    injected = "injected",
    ejected = "ejected",
    none = "none"
}

// @ts-ignore - browser exists
var platform = typeof browser === 'undefined' ? chrome : browser

export class ProjectTabManager {
    injectTab = (tabId: number) => {
        platform.scripting.executeScript({
            target: { tabId: tabId },
            files: ['src/lib/editor/inject.js']
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

    async getTabProject(tab: chrome.tabs.Tab): Promise<Project> {
        const projectsMap = await projectTabsBucket.get()
        if (!tab.id) throw new Error("Tab id not found");

        if (!projectsMap[tab.id]) {
            projectsMap[tab.id] = this.createNewProject(tab);
        }
        return projectsMap[tab.id];
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

    createNewProject(tab: chrome.tabs.Tab): Project {
        // Get name and host from tab info
        let projectName = tab.title || this.getDefaultname(tab.url);

        // Cut project name down 
        if (projectName.length > MAX_TITLE_LENGTH) {
            projectName = projectName.slice(0, MAX_TITLE_LENGTH)
        }

        const projectUrl = tab.url
        const teamId = "teamId" // TODO: Get active team id

        const newProject = {
            id: nanoid(),
            name: projectName,
            teamId: teamId,
            hostUrl: projectUrl,
            activities: {},
            comments: [],
            hostData: {} as HostData,
            createdAt: new Date().toISOString(),
            githubHistoryIds: []
        } as Project
        return newProject;
    }

    async getTabState(tabId: number): Promise<TabState> {
        const stateMap = await tabStateStore.get();
        return stateMap[tabId] || TabState.none;
    }

    async setTabState(tabId: number, state: TabState) {
        tabStateStore.set({ [tabId]: state })
    }

    handleTabRefreshed = async (tabId: number) => {
        // When refreshed, script will be uninjected but we might want to restore injected state 
        const tabState = await this.getTabState(tabId)
        if (tabState === TabState.injected) {
            // Re-inject
            this.injectTab(tabId)
        } else {
            // Set to none
            this.setTabState(tabId, TabState.none)
        }
    }

    removeTabState(tabId: number) {
        tabStateStore.remove(tabId.toString())
    }
}