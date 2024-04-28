import { MessageService, MessageType } from '$shared/message'
import { authUserBucket, getActiveProject, popupStateBucket, setActiveProject } from '$lib/utils/localstorage'
import {
	activityApplyStream,
	activityRevertStream,
	applyProjectChangesStream,
	getScreenshotStream,
	sendSaveProject,
	sendEditEvent,
	sendEditProjectRequest
} from '$lib/utils/messaging'
import { baseUrl } from '$lib/utils/env'
import { ScreenshotService } from './screenshot'
import { PopupRoutes } from '$lib/utils/constants'
import { getCSSFramework } from '$lib/utils/styleFramework'
import { PublishProjectService } from '$lib/publish'
import { applyActivityChanges, revertActivityChanges } from '$lib/utils/activity'
import { AltScreenshotService } from './altScreenshot'

import type { EditEvent, Project } from '$shared/models'

const screenshotService = new ScreenshotService()
const altScreenshotService = new AltScreenshotService()
const messageService = MessageService.getInstance()

export function setupListeners() {
	// Listen for messages from console. Should always check for console only.
	messageService.subscribe(MessageType.DASHBOARD_AUTH, (user) => {
		authUserBucket.set({ authUser: user })
	})

	messageService.subscribe(MessageType.EDIT_EVENT, (event: EditEvent) => {
		sendEditEvent(event)
	})

	messageService.subscribe(MessageType.SAVE_PROJECT, async () => {
		const project = await getActiveProject()
		const publishService = new PublishProjectService(project, screenshotService, altScreenshotService)
		publishService.publish()
	})

	messageService.subscribe(MessageType.EDIT_PROJECT, (project: Project) => {
		// Pass to background script
		sendEditProjectRequest({ project, enable: true })
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
		// screenshotService.takeActivityScreenshot(activity)
	})
}

try {
	setupListeners()
	console.log('Content script loaded!')
} catch (e) {
	console.error(e)
}
