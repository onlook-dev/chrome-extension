import { getTabState, InjectState, saveTabState } from '$lib/utils/localstorage.js'

// @ts-ignore - browser exists
var platform = typeof browser === 'undefined' ? chrome : browser

export const toggleProjectTab = async (tabId: number, projectId: string, enable: boolean) => {
	const tabState = await getTabState(tabId)
	console.error('tabState', tabState)
	if (enable) {
		// toggle in: it's loadedTabs and needs injectedTabs
		if (tabState.state && tabState.state === InjectState.loaded) {
			platform.scripting.executeScript({
				target: { tabId: tabId },
				files: ['src/lib/editor/restore.js']
			})
		} else if (tabState.state === InjectState.none) {
			platform.scripting.executeScript({
				target: { tabId: tabId },
				files: ['src/lib/editor/inject.js']
			})
		}
		tabState.state = InjectState.injected
		tabState.projectId = projectId
	} else {
		// Eject
		platform.scripting.executeScript({
			target: { tabId: tabId },
			files: ['src/lib/editor/eject.js']
		})
		tabState.state = InjectState.loaded
		tabState.projectId = ''
	}

	saveTabState(tabId, tabState)
}
