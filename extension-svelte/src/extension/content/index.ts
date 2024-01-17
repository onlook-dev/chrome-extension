import { DASHBOARD_AUTH, DASHBOARD_URL, STYLE_CHANGE } from '$shared/constants'
import { authUserBucket } from '$lib/utils/localstorage'
import { activityInspectStream, sendStyleChange } from '$lib/utils/messaging'

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

	activityInspectStream.subscribe(([detail, sender]) => {
		simulateEventOnSelector(detail.selector, detail.event, detail.scrollToElement)
	})

	function simulateEventOnSelector(
		selector: string,
		event: string,
		scrollToElement: boolean = false
	) {
		const element = document.querySelector(selector)
		if (!element) return

		var rect = element.getBoundingClientRect()
		element.dispatchEvent(
			new MouseEvent(event, {
				clientX: rect.left + rect.width / 2,
				clientY: rect.top + rect.height / 2,
				bubbles: true,
				cancelable: true
			})
		)
		if (scrollToElement) {
			element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' })
		}
	}
}

try {
	setupListeners()
	console.log('Content script loaded!')
} catch (e) {
	console.error(e)
}
