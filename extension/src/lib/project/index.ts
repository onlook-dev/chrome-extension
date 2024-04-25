import { MAX_TITLE_LENGTH } from "$shared/constants";
import type { HostData } from "$shared/models/hostData";
import type { Project } from "$shared/models/project";
import { nanoid } from "nanoid";
import { get, writable } from "svelte/store";

const projectTabsStore = writable<{ [tabId: string]: Project }>({});
const tabStateStore = writable<{ [tabId: string]: TabState }>({});

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

    toggleTab = async (tab: chrome.tabs.Tab, projectId: string, inject?: boolean) => {
        if (!tab.id) throw new Error("Tab id not found");
        const tabState = await this.getTabState(tab.id)

        // Default to toggling state
        if (inject === undefined) {
            inject = !(tabState === TabState.injected)
        }

        console.log("Toggling tab", tab.id, inject, tabState)
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

    getTabProject(tab: chrome.tabs.Tab): Project {
        const projectsMap = get(projectTabsStore);
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

    getTabState(tabId: number): TabState {
        const stateMap = get(tabStateStore);
        return stateMap[tabId] || TabState.none;
    }

    setTabState(tabId: number, state: TabState) {
        tabStateStore.update(stateMap => {
            stateMap[tabId] = state;
            return stateMap;
        });
    }

    handleTabRefreshed = async (tabId: number) => {
        console.log("Tab refreshed", tabId)
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
        tabStateStore.update(stateMap => {
            delete stateMap[tabId];
            return stateMap;
        });
    }
}