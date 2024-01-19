import { visbugStateBucket } from '$lib/utils/localstorage.js'
import { getColorMode } from './contextmenu/colormode.js'
import { getColorScheme } from './contextmenu/colorscheme.js'

// @ts-ignore
var platform = typeof browser === 'undefined' ? chrome : browser

export const toggleIn = async (tabId: number, projectId?: string) => {
	let visbugState = await visbugStateBucket.get()

	// toggle out: it's currently loadedTabs and injectedTabs
	if (visbugState.loadedTabs[tabId] && visbugState.injectedTabs[tabId]) {
		platform.scripting.executeScript({
			target: { tabId: tabId },
			files: ['src/lib/visbug/toolbar/eject.js']
		})
		visbugState.injectedTabs[tabId] = false
		if (projectId) visbugState.injectedProjects[projectId] = false
	}

	// toggle in: it's loadedTabs and needs injectedTabs
	else if (visbugState.loadedTabs[tabId] && !visbugState.injectedTabs[tabId]) {
		platform.scripting.executeScript({
			target: { tabId: tabId },
			files: ['src/lib/visbug/toolbar/restore.js']
		})
		visbugState.injectedTabs[tabId] = true
		if (projectId) visbugState.injectedProjects[projectId] = true

		getColorMode()
		getColorScheme()
	}

	// fresh start in tab
	else {
		platform.scripting.insertCSS({
			target: { tabId: tabId },
			files: ['src/lib/visbug/toolbar/bundle.css']
		})
		platform.scripting.executeScript({
			target: { tabId: tabId },
			files: ['src/lib/visbug/toolbar/inject.js']
		})

		visbugState.loadedTabs[tabId] = true
		visbugState.injectedTabs[tabId] = true
		if (projectId) visbugState.injectedProjects[projectId] = true
		getColorMode()
		getColorScheme()
	}

	platform.tabs.onUpdated.addListener(function (tabId: number) {
		console.log('tab updated', tabId)
		if (tabId === tabId) {
			visbugState.loadedTabs[tabId] = false
			visbugState.injectedTabs[tabId] = false
			if (projectId) visbugState.injectedProjects[projectId] = false
		}
	})

	visbugStateBucket.set(visbugState)
}
