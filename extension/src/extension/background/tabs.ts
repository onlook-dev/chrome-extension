import { storeImageUri } from '$lib/firebase/functions'
import { debounce } from '$shared/helpers'
import {
	getActiveProject,
	getTabState,
	InjectState,
	projectsMapBucket,
	type VisbugState
} from '$lib/utils/localstorage'
import { toggleProjectTab } from '$lib/editor'
import { MessageReceiver, sendApplyProjectChanges } from '$lib/utils/messaging'
import { captureTab } from './screenshot'
import { FirebaseProjectService } from '$lib/storage/project'

import type { HostData, Project } from '$shared/models'

export const updateProjectTabHostWithDebounce = debounce((tab: chrome.tabs.Tab) => {
	updateProjectTabHostData(tab)
}, 5000)

async function updateProjectTabHostData(tab: chrome.tabs.Tab) {
	// Get active project
	const activeProject = await getActiveProject()
	if (!activeProject) return

	// Check if project already has host data
	if (activeProject.hostData.previewImage && activeProject.hostData.favicon) return

	// Get host data from tab

	// Get favicon
	let favicon
	if (!activeProject.hostData.favicon) {
		favicon = tab.favIconUrl
	}

	// Get preview image
	let previewImage
	if (!activeProject.hostData.previewImage) {
		const dataUri = await captureTab(tab.windowId as number)
		const result = await storeImageUri({ dataUri })
		previewImage = result.data
	}

	let hostData = {
		favicon,
		previewImage
	} as HostData

	// Update project with host data
	activeProject.hostData = hostData

	// Save project
	const projectService = new FirebaseProjectService()
	projectService.post(activeProject)
	projectsMapBucket.set({ [activeProject.id]: activeProject })
}

export function sameTabHost(url1: string, url2: string) {
	try {
		const url1Obj = new URL(url1)
		const url2Obj = new URL(url2)

		return url1Obj.origin === url2Obj.origin
	} catch (e) {
		return false
	}
}

export function updateTabActiveState(tab: chrome.tabs.Tab, project: Project, enable: boolean) {
	updateProjectTabHostWithDebounce(tab)
	toggleProjectTab(tab.id as number, project.id, enable)

	// Forward message after a delay
	// TODO: This is to ensure that content scripts are injected 
	setTimeout(() => {
		chrome.tabs.sendMessage(tab.id as number, {
			greeting: 'APPLY_PROJECT_CHANGES',
			payload: {
				data: {},
				to: MessageReceiver.CONTENT
			}
		});

		sendApplyProjectChanges(undefined, {
			tabId: tab.id
		})
	}, 100)

}

export function forwardToActiveProjectTab(detail: any, callback: any) {
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
