import {
	MessageTypes,
	DashboardRoutes
} from '$shared/constants'
import { authUserBucket, getActiveProject, getProjectById, popupStateBucket, setActiveProject } from '$lib/utils/localstorage'
import {
	activityApplyStream,
	activityInspectStream,
	activityRevertStream,
	applyProjectChangesStream,
	getScreenshotStream,
	sendOpenUrlRequest,
	sendSaveProject,
	sendEditEvent,
	sendEditProjectRequest
} from '$lib/utils/messaging'
import type { Activity } from '$shared/models/activity'
import type { EditEvent, } from '$shared/models/editor'
import { baseUrl } from '$lib/utils/env'
import { activityScreenshotQueue, processScreenshotQueue } from './screenshot'
import type { Project } from '$shared/models/project'
import { PopupRoutes } from '$lib/utils/constants'

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
		Object.entries(activity.styleChanges ?? {}).forEach(([style, changeObject]) => {
			// Apply style to element
			element.style[style] = changeObject.newVal
		})
		Object.entries(activity.textChanges ?? {}).forEach(([textChange, changeObject]) => {
			// Apply style to element
			element.innerText = changeObject.newVal
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
		Object.entries(activity.styleChanges ?? {}).forEach(([style, changeObject]) => {
			// Apply style to element
			if (style === 'text') {
				element.innerText = changeObject.oldVal
			} else {
				element.style[style] = changeObject.oldVal
			}
		})
	}
}

export function setupListeners() {
	// Listen for messages from console. Should always check for console only.
	window.addEventListener('message', event => {
		if (event.source != window) return

		const message = event.data

		if (message.type === MessageTypes.DASHBOARD_AUTH && event.origin === baseUrl && message.user) {
			authUserBucket.set({ authUser: message.user })
			return
		}

		if (message.type === MessageTypes.EDIT_EVENT) {
			const editorStyleChange = message.detail as EditEvent
			sendEditEvent(editorStyleChange)
			return
		}

		if (message.type === MessageTypes.OPEN_PROJECT) {
			getActiveProject().then(project => {
				sendSaveProject(project)
				sendOpenUrlRequest(`${baseUrl}${DashboardRoutes.PROJECTS}/${project?.id}`)
			})
			return
		}

		if (message.type === MessageTypes.EDIT_PROJECT) {
			if (message.project) {
				let project = message.project as Project
				setActiveProject(project.id)
				popupStateBucket.set({ activeRoute: PopupRoutes.PROJECT, activeProjectId: project.id })
				sendEditProjectRequest({ project, enable: true })
			}
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
