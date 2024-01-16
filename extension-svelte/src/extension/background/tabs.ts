import { storeImageUri } from '$lib/firebase/functions'
import { postProjectToFirebase } from '$lib/storage/project'
import { debounce } from '$shared/debounce'
import { getActiveProject, projectsMapBucket } from '$lib/utils/localstorage'
import type { HostData } from '$shared/models/hostData'

export const updateProjectTabHostWithDebounce = debounce((tab: chrome.tabs.Tab) => {
	updateProjectTabHostData(tab)
}, 3000)

async function updateProjectTabHostData(tab: chrome.tabs.Tab) {
	console.log('Updating project with host data')
	// Get active project
	const activeProject = await getActiveProject()
	if (!activeProject) return

	// Check if project already has host data
	if (activeProject.hostData.previewImage && activeProject.hostData.favicon) return

	// Get host data from tab
	const hostData = await getHostDataFromTab(tab)

	// Update project with host data
	activeProject.hostData = hostData

	// Save project
	postProjectToFirebase(activeProject)
	projectsMapBucket.set({ [activeProject.id]: activeProject })
	console.log('Updated project with host data')
}

export async function getHostDataFromTab(tab: chrome.tabs.Tab): Promise<HostData> {
	const dataUri = await captureTab(tab.windowId as number)
	const result = await storeImageUri({ dataUri })

	// Take screenshot of tab
	let hostData = {
		favicon: tab.favIconUrl,
		previewImage: result.data
	} as HostData
	return hostData
}

async function captureTab(windowId: number): Promise<string> {
	return new Promise((resolve, reject) => {
		chrome.tabs.captureVisibleTab(windowId, { format: 'jpeg' }, dataUri => {
			if (chrome.runtime.lastError) {
				reject(chrome.runtime.lastError)
			} else {
				resolve(dataUri)
			}
		})
	})
}
