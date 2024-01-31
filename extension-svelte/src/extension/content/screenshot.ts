import html2canvas from 'html2canvas'
import type { Activity } from '$shared/models/activity'
import { getProjectById } from '$lib/utils/localstorage'
import { sendSaveProject } from '$lib/utils/messaging'

const elementRequestCount = new Map()

function takeElementScreenshot(element: HTMLElement, quality = 0) {
	return html2canvas(element, {
		useCORS: true
	}).then(canvas => {
		const image = canvas.toDataURL('image/jpeg', quality)
		canvas.remove()
		return image
	})
}

export async function takeActivityScreenshot(activity: Activity) {
	// Get element
	const element = document.querySelector(activity.selector) as HTMLElement
	if (!element) return

	// Check request count
	const count = elementRequestCount.get(activity.selector) || 0
	if (count === 0) {
		elementRequestCount.set(activity.selector, 1)
		return
	}

	// Get screenshot
	const dataUrl = await takeElementScreenshot(element)
	activity.previewImage = dataUrl

	// Update project
	const project = await getProjectById(activity.projectId)
	project.activities[activity.selector] = activity
	sendSaveProject(project)

	// Remove from map after taking screenshot
	elementRequestCount.delete(activity.selector)
}
