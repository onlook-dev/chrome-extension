import { getColorMode } from './contextmenu/colormode.js'
import { getColorScheme } from './contextmenu/colorscheme.js'

var platform = typeof browser === 'undefined' ? chrome : browser

interface State {
	loaded: Record<number, boolean>
	injected: Record<number, boolean>
}

export const visbugState = {
	loaded: {} as Record<number, boolean>,
	injected: {} as Record<number, boolean>
}

export const toggleIn = (tab: chrome.tabs.Tab) => {
	let tab_id = tab.id ?? 0
	// toggle out: it's currently loaded and injected
	if (visbugState.loaded[tab_id] && visbugState.injected[tab_id]) {
		platform.scripting.executeScript({
			target: { tabId: tab_id },
			files: ['src/lib/visbug/toolbar/eject.js']
		})
		visbugState.injected[tab_id] = false
	}

	// toggle in: it's loaded and needs injected
	else if (visbugState.loaded[tab_id] && !visbugState.injected[tab_id]) {
		platform.scripting.executeScript({
			target: { tabId: tab_id },
			files: ['src/lib/visbug/toolbar/restore.js']
		})
		visbugState.injected[tab_id] = true
		getColorMode()
		getColorScheme()
	}

	// fresh start in tab
	else {
		platform.scripting.insertCSS({
			target: { tabId: tab_id },
			files: ['src/lib/visbug/toolbar/bundle.css']
		})
		platform.scripting.executeScript({
			target: { tabId: tab_id },
			files: ['src/lib/visbug/toolbar/inject.js']
		})

		visbugState.loaded[tab_id] = true
		visbugState.injected[tab_id] = true
		getColorMode()
		getColorScheme()
	}

	platform.tabs.onUpdated.addListener(function (tabId: number) {
		if (tabId === tab_id) visbugState.loaded[tabId] = false
	})
}
