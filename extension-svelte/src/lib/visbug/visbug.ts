import { getTabState, InjectState, saveTabState } from '$lib/utils/localstorage.js'
import { getColorMode } from './contextmenu/colormode.js'
import { getColorScheme } from './contextmenu/colorscheme.js'

// @ts-ignore - browser exists
var platform = typeof browser === 'undefined' ? chrome : browser

export const toggleProjectTab = async (tabId: number, projectId: string, enable: boolean) => {
	const tabState = await getTabState(tabId)
	if (enable) {
		// toggle in: it's loadedTabs and needs injectedTabs
		if (tabState.state && tabState.state === InjectState.loaded) {
			platform.scripting.executeScript({
				target: { tabId: tabId },
				files: ['src/lib/visbug/toolbar/restore.js']
			})
		} else if (tabState.state === InjectState.none) {
			// fresh start in tab. Load and inject.
			platform.scripting.insertCSS({
				target: { tabId: tabId },
				files: ['src/lib/visbug/toolbar/bundle.css']
			})
			platform.scripting.executeScript({
				target: { tabId: tabId },
				files: ['src/lib/visbug/toolbar/inject.js']
			})
		}
		tabState.state = InjectState.injected
		tabState.projectId = projectId
		getColorMode()
		getColorScheme()
	} else {
		// Eject
		platform.scripting.executeScript({
			target: { tabId: tabId },
			files: ['src/lib/visbug/toolbar/eject.js']
		})
		tabState.state = InjectState.loaded
		tabState.projectId = ''
	}
	saveTabState(tabId, tabState)
}
