import { toJpeg } from 'html-to-image'
import type { Activity } from '$shared/models/activity'
import { getProjectById, projectsMapBucket } from '$lib/utils/localstorage'
import { isBase64ImageString } from '$shared/helpers'

export let activityScreenshotQueue: Activity[] = []
const elementRequestCount = new Map()

export async function processScreenshotQueue() {
	while (activityScreenshotQueue.length > 0) {
		const activity = activityScreenshotQueue[0] // Get the first item from the queue without removing it
		await takeActivityScreenshot(activity) // Process it
		activityScreenshotQueue.shift() // Remove the processed item from the queue
	}
}

function takeElementScreenshot(element: HTMLElement) {
	if (element.tagName === 'CODE' && element.parentElement) {
		element = element.parentElement
	}
	return toJpeg(element, {
		quality: 0,
		backgroundColor: element.style.backgroundColor || '#fafafa'
	}).then(function (dataUrl) {
		return dataUrl
	})
}

async function takeActivityScreenshot(activity: Activity) {
	// Get element
	const element = document.querySelector(activity.selector) as HTMLElement
	if (!element) return

	// Skip first request because our debounce does one request immediately
	// (which is redundant because it gets overwritten by the next screenshot)
	const count = elementRequestCount.get(activity.selector) || 0
	if (count === 0) {
		elementRequestCount.set(activity.selector, 1)
		return
	}

	// Get screenshot
	const dataUrl = await takeElementScreenshot(element)
	if (isBase64ImageString(dataUrl)) {
		activity.previewImage = dataUrl
	}

	// Update project
	const project = await getProjectById(activity.projectId)
	project.activities[activity.selector] = activity
	projectsMapBucket.set({ [project.id]: project })

	// Remove from map after taking screenshot
	elementRequestCount.delete(activity.selector)
}
