import { DASHBOARD_AUTH, DASHBOARD_URL, STYLE_CHANGE } from '$shared/constants'
import { authUserBucket, changeMapBucket } from '$lib/utils/localstorage'

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

		if (message.type === STYLE_CHANGE) {
			// TODO: Should add check for origin being same as project URL
			saveStyleChange(message.detail)
			return
		}
	})
}

async function saveStyleChange(detail: any) {
	const oldMap = (await changeMapBucket.get()) as any
	const oldVal = oldMap[detail.selector] ?? {}
	changeMapBucket.set({ [detail.selector]: { ...oldVal, ...detail.newValue } })
}

try {
	setupListeners()
	console.log('Content script loaded!')
} catch (e) {
	console.error(e)
}
