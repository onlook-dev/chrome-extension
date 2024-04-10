import { toJpeg } from 'html-to-image'
import type { Activity } from '$shared/models/activity'
import { getProjectById, projectsMapBucket } from '$lib/utils/localstorage'
import { isBase64ImageString } from '$shared/helpers'

export class ScreenshotService {
	activityScreenshotQueue: Activity[] = []
	elementRequestCount = new Map()

	async takeScreenshot(activity: Activity) {
		this.activityScreenshotQueue.push(activity)

		if (this.activityScreenshotQueue.length === 1) {
			// Only start processing if this is the only item in the queue
			await this.processScreenshotQueue()
		}
	}

	private async processScreenshotQueue() {
		while (this.activityScreenshotQueue.length > 0) {
			// Process item in queue 1 by 1
			const activity = this.activityScreenshotQueue[0]
			await this.takeActivityScreenshot(activity)

			// Remove the processed item from the queue
			this.activityScreenshotQueue.shift()
		}
	}

	private async takeActivityScreenshot(activity: Activity) {
		// Get element
		const element = document.querySelector(activity.selector) as HTMLElement
		if (!element) return

		// Get screenshot
		const dataUrl = await this.takeElementScreenshot(element)
		if (isBase64ImageString(dataUrl)) {
			activity.previewImage = dataUrl
		}

		// Update project
		const project = await getProjectById(activity.projectId)
		project.activities[activity.selector] = activity
		projectsMapBucket.set({ [project.id]: project })

		// Remove from map after taking screenshot
		this.elementRequestCount.delete(activity.selector)
	}


	private takeElementScreenshot(element: HTMLElement) {
		if (element.tagName === 'CODE' && element.parentElement) {
			element = element.parentElement
		}
		return toJpeg(element, {
			quality: 0.1,
			backgroundColor: element.style.backgroundColor || '#fafafa'
		}).then(function (dataUrl) {
			return dataUrl
		})
	}
}
