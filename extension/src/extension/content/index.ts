import { MessageService, MessageType } from '$shared/message'
import { authUserBucket, projectsMapBucket } from '$lib/utils/localstorage'
import {
	activityApplyStream,
	activityRevertStream,
	applyProjectChangesStream,
	getScreenshotStream,
	sendEditEvent,
	sendEditProjectRequest
} from '$lib/utils/messaging'
import { ScreenshotService } from './screenshot'
import { PublishProjectService } from '$lib/publish'
import { applyActivityChanges, revertActivityChanges } from '$lib/utils/activity'
import { AltScreenshotService } from './altScreenshot'
import { ProjectTabService } from '$lib/tabs'

import { ProjectStatus, type EditEvent, type Project } from '$shared/models'

const screenshotService = new ScreenshotService()
const altScreenshotService = new AltScreenshotService()
const messageService = MessageService.getInstance()
const projectTabManager = new ProjectTabService()

export function setupListeners() {
	// Listen for messages from console. Should always check for console only.
	messageService.subscribe(MessageType.DASHBOARD_SIGN_IN, (user) => {
		authUserBucket.set({ authUser: user })
	})

	messageService.subscribe(MessageType.DASHBOARD_SIGN_OUT, () => {
		authUserBucket.clear()
	})

	messageService.subscribe(MessageType.EDIT_EVENT, (event: EditEvent) => {
		sendEditEvent(event)
	})

	messageService.subscribe(MessageType.PREPARE_SAVE, async (payload, correlationId) => {
		if (correlationId)
			// Confirm save received
			messageService.respond({}, correlationId)

		const currentTab = await projectTabManager.getCurrentTab()
		const project = await projectTabManager.getTabProject(currentTab)

		// Prepare project for saving
		if (!project.status || project.status === ProjectStatus.DRAFT) {
			const publishService = new PublishProjectService(project, screenshotService, altScreenshotService)
			publishService.prepare()
		}
	})

	messageService.subscribe(MessageType.SAVE_PROJECT, async () => {
		const currentTab = await projectTabManager.getCurrentTab()
		const project = await projectTabManager.getTabProject(currentTab)
		const publishService = new PublishProjectService(project, screenshotService, altScreenshotService)
		publishService.publish()
	})

	messageService.subscribe(MessageType.GET_PROJECT, async (payload, correlationId) => {
		const currentTab = await projectTabManager.getCurrentTab()
		const project = await projectTabManager.getTabProject(currentTab)
		if (correlationId)
			messageService.respond(project, correlationId)
	})

	messageService.subscribe(MessageType.GET_PROJECTS, async (payload, correlationId) => {
		const projects = Object.values(await projectsMapBucket.get())
		if (correlationId)
			messageService.respond(projects, correlationId)
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
		// TODO: handle this
		// const activeProject = await getActiveProject()
		// if (!activeProject) return

		// let shouldSaveProject = false

		// // Get each activity and their style change
		// Object.values(activeProject.activities).forEach(activity => {
		// 	let activityMutated = applyActivityChanges(activity)
		// 	if (activityMutated) {
		// 		activeProject.activities[activity.selector] = activity
		// 		shouldSaveProject = true
		// 	}
		// })

		// // Get style framework if did not exist
		// if (!activeProject.projectSettings?.styleFramework) {
		// 	const styleFramework = await getCSSFramework()
		// 	activeProject.projectSettings = {
		// 		...activeProject.projectSettings,
		// 		styleFramework
		// 	}
		// 	shouldSaveProject = true
		// }

		// if (shouldSaveProject) {
		// 	sendSaveProject(activeProject)
		// }
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
