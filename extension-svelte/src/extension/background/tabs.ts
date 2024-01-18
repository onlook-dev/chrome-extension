import { storeImageUri } from '$lib/firebase/functions'
import { postProjectToFirebase } from '$lib/storage/project'
import { debounce } from '$shared/helpers'
import { getActiveProject, projectsMapBucket } from '$lib/utils/localstorage'
import type { HostData } from '$shared/models/hostData'

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
	postProjectToFirebase(activeProject)
	projectsMapBucket.set({ [activeProject.id]: activeProject })
	console.log('Updated project with host data')
}

async function captureTab(windowId: number): Promise<string> {
	return new Promise((resolve, reject) => {
		chrome.tabs.captureVisibleTab(windowId, { format: 'jpeg', quality: 0 }, dataUri => {
			if (chrome.runtime.lastError) {
				reject(chrome.runtime.lastError)
			} else {
				resolve(dataUri)
			}
		})
	})
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
