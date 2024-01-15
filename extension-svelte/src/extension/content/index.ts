import { DASHBOARD_AUTH, DASHBOARD_URL, STYLE_CHANGE } from '$shared/constants'
import { authUserBucket } from '$lib/utils/localstorage'

export function setupListeners() {
	// Listen for messages from console. Should always check for console only.
	window.addEventListener('message', event => {
		if (event.source != window || event.origin != DASHBOARD_URL) return
		const message = event.data
		if (message.type === DASHBOARD_AUTH && message.user) {
			authUserBucket.set({ authUser: message.user })
		} else if (message.type === STYLE_CHANGE) {
			console.log(message.detail)
		}
	})
}

try {
	setupListeners()
	console.log('Content script loaded!')
} catch (e) {
	console.error(e)
}
