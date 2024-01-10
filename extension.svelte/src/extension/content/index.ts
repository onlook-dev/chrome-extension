import { DASHBOARD_AUTH, DASHBOARD_URL, IMPORT_PROJECT } from '$lib/utils/constants'
import { userBucket } from '$lib/utils/localstorage'

export function setupListeners() {
	// Listen for messages from console. Should always check for console only.
	window.addEventListener('message', event => {
		if (event.source != window || event.origin != DASHBOARD_URL) return
		const message = event.data
		if (message.type === DASHBOARD_AUTH && message.user) {
			userBucket.set({ authUser: message.user })
		}
	})
}

try {
	setupListeners()
	console.log('Content script loaded!')
} catch (e) {
	console.error(e)
}
