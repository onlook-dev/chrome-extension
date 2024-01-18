import { DASHBOARD_AUTH, DASHBOARD_URL, STYLE_CHANGE } from '$shared/constants'
import { authUserBucket, getActiveProject } from '$lib/utils/localstorage'
import {
	activityInspectStream,
	applyProjectChangesStream,
	sendStyleChange
} from '$lib/utils/messaging'

function simulateEventOnSelector(
	selector: string,
	event: string,
	scrollToElement: boolean = false
) {
	const element = document.querySelector(selector)
	if (!element) return

	// TODO: This sometimes catches the child elements instead.
	const rect = element.getBoundingClientRect()

	const mouseEvent = new MouseEvent(event, {
		clientX: rect.x + 1,
		clientY: rect.y + 1,
		bubbles: false,
		cancelable: true
	})
	element.dispatchEvent(mouseEvent)

	if (scrollToElement) {
		element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' })
	}
}

export function setupListeners() {
	// Listen for messages from console. Should always check for console only.
	window.addEventListener('message', event => {
		if (event.source != window) return

		const message = event.data

		if (message.type === DASHBOARD_AUTH && event.origin === DASHBOARD_URL && message.user) {
			authUserBucket.set({ authUser: message.user })
			return
		}

		// TODO: Should add check for origin being same as project URL
		if (message.type === STYLE_CHANGE) {
			sendStyleChange(message.detail)
			return
		}
	})

	activityInspectStream.subscribe(([detail, sender]) => {
		// TODO: This is not reliable enough. Choosing wrong element and not applying changes.
		simulateEventOnSelector(detail.selector, detail.event, detail.scrollToElement)
	})

	applyProjectChangesStream.subscribe(async () => {
		const activeProject = await getActiveProject()
		if (!activeProject) return

		// Get each activity and their style change
		Object.values(activeProject.activities).forEach(activity => {
			const element = document.querySelector(activity.selector) as any
			if (element) {
				Object.entries(activity.styleChanges).forEach(([style, changeObject]) => {
					// Apply style to element
					element.style[style] = changeObject.newVal
				})
			}
		})
	})
}

try {
	setupListeners()
	console.log('Content script loaded!')
} catch (e) {
	console.error(e)
}
