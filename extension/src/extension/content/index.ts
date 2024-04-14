import {
	MessageTypes,
	DashboardRoutes
} from '$shared/constants'
import { authUserBucket, getActiveProject, popupStateBucket, setActiveProject } from '$lib/utils/localstorage'
import {
	activityApplyStream,
	activityRevertStream,
	applyProjectChangesStream,
	getScreenshotStream,
	sendOpenUrlRequest,
	sendSaveProject,
	sendEditEvent,
	sendEditProjectRequest
} from '$lib/utils/messaging'
import type { EditEvent, } from '$shared/models/editor'
import { baseUrl } from '$lib/utils/env'
import { ScreenshotService } from './screenshot'
import type { Project } from '$shared/models/project'
import { PopupRoutes } from '$lib/utils/constants'
import { getCSSFramework } from '$lib/utils/styleFramework'
import { PublishProjectService } from '$lib/publish'
import { applyActivityChanges, revertActivityChanges } from '$lib/utils/activity'

const screenshotService = new ScreenshotService()

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
			getActiveProject().then((project) => {
				const publishService = new PublishProjectService(project, screenshotService)
				publishService.publish()
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

		// Get style framework if did not exist
		if (!activeProject.projectSettings?.styleFramework) {
			const styleFramework = await getCSSFramework()
			activeProject.projectSettings = {
				...activeProject.projectSettings,
				styleFramework
			}
			shouldSaveProject = true
		}

		if (shouldSaveProject) {
			sendSaveProject(activeProject)
		}
	})

	getScreenshotStream.subscribe(async ([activity]) => {
		screenshotService.takeActivityScreenshot(activity)
	})
}

try {
	setupListeners()
	console.log('Content script loaded!')
} catch (e) {
	console.error(e)
}
