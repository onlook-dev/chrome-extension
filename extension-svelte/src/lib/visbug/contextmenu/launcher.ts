// TODO: We don't really need this rn. This sets up the context menu

import { toggleIn } from '../visbug'

// @ts-ignore
var platform = typeof browser === 'undefined' ? chrome : browser

platform.action.onClicked.addListener(toggleIn)

platform.contextMenus.create({
	id: 'launcher',
	title: 'Show/Hide',
	contexts: ['all']
})

platform.contextMenus.onClicked.addListener(({ menuItemId }: any, tab: chrome.tabs.Tab) => {
	if (menuItemId === 'launcher') toggleIn(tab.id as number)
})
