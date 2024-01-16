import { DASHBOARD_AUTH, DASHBOARD_URL, STYLE_CHANGE } from '$shared/constants'
import { authUserBucket } from '$lib/utils/localstorage'
import { sendStyleChange } from '$lib/utils/messaging'

export function setupListeners() {
	// Listen for messages from console. Should always check for console only.
	window.addEventListener('message', event => {
		if (event.source != window) return

		const message = event.data

		if (message.type === DASHBOARD_AUTH && event.origin === DASHBOARD_URL && message.user) {
			authUserBucket.set({ authUser: message.user })
			console.log('Auth user set')
			return
		}

		// TODO: Should add check for origin being same as project URL
		if (message.type === STYLE_CHANGE) {
			sendStyleChange(message.detail)
			return
		}
	})
}

try {
	setupListeners()
	console.log('Content script loaded!')
} catch (e) {
	console.error(e)
}
