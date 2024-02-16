import {
	DASHBOARD_AUTH,
	REDO_STYLE_CHANGE,
	STYLE_CHANGE,
	UNDO_STYLE_CHANGE
} from '$shared/constants'
import { authUserBucket, getActiveProject } from '$lib/utils/localstorage'
import {
	activityApplyStream,
	activityInspectStream,
	activityRevertStream,
	applyProjectChangesStream,
	getScreenshotStream,
	sendSaveProject,
	sendStyleChange
} from '$lib/utils/messaging'
import type { Activity } from '$shared/models/activity'
import type { VisbugStyleChange } from '$shared/models/visbug'
import { baseUrl } from '$lib/utils/env'
import { activityScreenshotQueue, processScreenshotQueue } from './screenshot'
import { convertVisbugToStyleChangeMap } from '$shared/helpers'

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

function applyActivityChanges(activity: Activity): boolean {
	const element = document.querySelector(activity.selector) as any
	if (element) {
		Object.entries(activity.styleChanges).forEach(([style, changeObject]) => {
			// Apply style to element
			if (style === 'text') {
				element.innerText = changeObject.newVal
			} else {
				element.style[style] = changeObject.newVal
			}
		})
		if (activity.path !== element.dataset.onlookId) {
			activity.path = element.dataset.onlookId
			return true
		}
	}
	return false
}

function revertActivityChanges(activity: Activity) {
	const element = document.querySelector(activity.selector) as any
	if (element) {
		Object.entries(activity.styleChanges).forEach(([style, changeObject]) => {
			// Apply style to element
			if (style === 'text') {
				element.innerText = changeObject.oldVal
			} else {
				element.style[style] = changeObject.oldVal
			}
		})
	}
}

export function applyVisbugStyleChange(visbugStyleChange: VisbugStyleChange) {
	const element = document.querySelector(visbugStyleChange.selector) as any
	const styleChanges = convertVisbugToStyleChangeMap(visbugStyleChange)
	Object.entries(styleChanges).forEach(([style, changeObject]) => {
		// Apply style to element
		if (style === 'text') {
			element.innerText = changeObject.newVal
		} else {
			element.style[style] = changeObject.newVal
		}
	})
}

export function setupListeners() {
	// Listen for messages from console. Should always check for console only.
	window.addEventListener('message', event => {
		if (event.source != window) return

		const message = event.data

		if (message.type === DASHBOARD_AUTH && event.origin === baseUrl && message.user) {
			authUserBucket.set({ authUser: message.user })
			return
		}

		if (message.type === STYLE_CHANGE) {
			const visbugStyleChange = message.detail as VisbugStyleChange
			sendStyleChange(visbugStyleChange)
			return
		}

		if (message.type === UNDO_STYLE_CHANGE) {
			const visbugStyleChange = message.detail as VisbugStyleChange
			applyVisbugStyleChange(visbugStyleChange)
			sendStyleChange(visbugStyleChange)
			return
		}

		if (message.type === REDO_STYLE_CHANGE) {
			const visbugStyleChange = message.detail as VisbugStyleChange
			applyVisbugStyleChange(visbugStyleChange)
			sendStyleChange(visbugStyleChange)
			return
		}
	})

	activityInspectStream.subscribe(([detail, sender]) => {
		// TODO: This is not reliable enough. Choosing wrong element and not applying changes.
		simulateEventOnSelector(detail.selector, detail.event, detail.scrollToElement)
	})

	activityRevertStream.subscribe(([activity, sender]) => {
		revertActivityChanges(activity)
	})

	activityApplyStream.subscribe(([activity, sender]) => {
		applyActivityChanges(activity)
	})

	applyProjectChangesStream.subscribe(async () => {
		const activeProject = await getActiveProject()
		if (!activeProject) return

		let shouldSaveProject = false

		// Get each activity and their style change
		Object.values(activeProject.activities).forEach(activity => {
			let activityMutated = applyActivityChanges(activity)
			if (activityMutated) {
				activeProject.activities[activity.selector] = activity
				shouldSaveProject = true
			}
		})

		if (shouldSaveProject) {
			sendSaveProject(activeProject)
		}
	})

	getScreenshotStream.subscribe(async ([activity]) => {
		activityScreenshotQueue.push(activity)

		// Process the queue
		if (activityScreenshotQueue.length === 1) {
			// Only start processing if this is the only item in the queue
			await processScreenshotQueue()
		}
	})
}

try {
	setupListeners()
	console.log('Content script loaded!')
} catch (e) {
	console.error(e)
}