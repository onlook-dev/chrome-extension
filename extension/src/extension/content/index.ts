import { MESSAGING_NAMESPACE, MessageService, MessageType } from '$shared/message'
import { authUserBucket, projectsMapBucket } from '$lib/utils/localstorage'
import {
	applyProjectChangesStream,
	sendEditEvent,
	sendEditProjectRequest,
	sendOpenUrlRequest
} from '$lib/utils/messaging'
import { ScreenshotService } from './screenshot'
import { PublishProjectService } from '$lib/publish'
import { AltScreenshotService } from './altScreenshot'
import { ProjectTabService } from '$lib/projects'
import { ProjectChangeService } from '$lib/projects/changes'

import { ProjectStatus, type EditEvent, type Project } from '$shared/models'
import { allowWindowMessaging } from "webext-bridge/content-script";

const screenshotService = new ScreenshotService()
const altScreenshotService = new AltScreenshotService()
const messageService = MessageService.getInstance()
const projectTabManager = new ProjectTabService()
const projectChangeService = new ProjectChangeService()

export function setupListeners() {
	allowWindowMessaging(MESSAGING_NAMESPACE);

	// Listen for messages from console. Should always check for console only.
	messageService.subscribe(MessageType.DASHBOARD_SIGN_IN, (user) => {
		authUserBucket.set({ authUser: user })
	})

	messageService.subscribe(MessageType.OPEN_URL, payload => {
		sendOpenUrlRequest({ url: payload.url, inject: payload.inject })
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
			const publishService = new PublishProjectService(project, screenshotService, altScreenshotService, projectChangeService)
			publishService.prepare()
		}
	})

	messageService.subscribe(MessageType.PUBLISH_PROJECT, async (open, correlationId) => {
		const currentTab = await projectTabManager.getCurrentTab()
		const project = await projectTabManager.getTabProject(currentTab)
		const publishService = new PublishProjectService(project, screenshotService, altScreenshotService, projectChangeService)
		await publishService.publish(open)

		if (correlationId)
			// Confirm save received
			messageService.respond({}, correlationId)
	})

	messageService.subscribe(MessageType.GET_PROJECT, async (payload, correlationId) => {
		const currentTab = await projectTabManager.getCurrentTab()
		const project = await projectTabManager.getTabProject(currentTab)
		if (correlationId)
			messageService.respond(project, correlationId)
	})

	messageService.subscribe(MessageType.GET_PROJECTS, async (payload, correlationId) => {
		const currentTab = await projectTabManager.getCurrentTab()
		let projects = []

		if (currentTab.url) {
			const currentHost = new URL(currentTab.url).hostname
			const map = await projectsMapBucket.get()
			projects = Object.values(map).filter((project: Project) => {
				if (!project || !project.hostUrl)
					return false
				// Filter for projects with the same URL host
				const projectHost = new URL(project.hostUrl).hostname
				return currentHost === projectHost
			})
		}

		if (correlationId)
			messageService.respond(projects, correlationId)
	})

	messageService.subscribe(MessageType.EDIT_PROJECT, async (project: Project) => {
		// Pass to background script
		sendEditProjectRequest({ project, enable: true })
	})

	messageService.subscribe(MessageType.MERGE_PROJECT, async (project, correlationId) => {
		const projectChangeService = new ProjectChangeService()
		const currentTab = await projectTabManager.getCurrentTab()
		const currentProject = await projectTabManager.getTabProject(currentTab)
		const newProject = projectChangeService.mergeProjects(currentProject, project)

		// Save over target project and remove currentProject
		await projectTabManager.setTabProject(currentTab, newProject)
		await projectTabManager.removeProject(currentProject)

		if (correlationId)
			messageService.respond({}, correlationId)

		// Apply project changes
		await projectChangeService.applyProjectChanges(newProject)
	})

	applyProjectChangesStream.subscribe(async () => {
		const tab = await projectTabManager.getCurrentTab()
		const project = await projectTabManager.getTabProject(tab)

		// Apply project changes
		await projectChangeService.applyProjectChanges(project)
	})
}

try {
	setupListeners()
} catch (e) {
	console.error(e)
}
