import type { EditorStyleChange } from '$shared/models/editor'
import type { Activity, ChangeValues } from '$shared/models/activity'
import { convertEditorToStyleChangeMap } from '$shared/translation'
import { getActiveProject, getActiveUser, projectsMapBucket } from '$lib/utils/localstorage'
import { sendGetScreenshotRequest } from '$lib/utils/messaging'
import { forwardToActiveProjectTab } from './tabs'
import { nanoid } from 'nanoid'

export let changeQueue: EditorStyleChange[] = []

export async function processChangeQueue() {
	while (changeQueue.length > 0) {
		const visbugStyleChange = changeQueue[0] // Get the first item from the queue without removing it
		await processStyleChange(visbugStyleChange) // Process it
		changeQueue.shift() // Remove the processed item from the queue
	}
}

async function processStyleChange(visbugStyleChange: EditorStyleChange) {
	const activeProject = await getActiveProject()
	if (!activeProject) return

	let activity = activeProject.activities[visbugStyleChange.selector]

	// Create activity if it doesn't exist
	if (!activity) {
		const user = await getActiveUser()
		activity = {
			id: nanoid(),
			userId: user.id,
			projectId: activeProject.id,
			eventData: [],
			createdAt: new Date().toISOString(),
			selector: visbugStyleChange.selector,
			path: visbugStyleChange.path,
			styleChanges: {},
			textChange: {},
			visible: true
		} as Activity
	}

	const mappedStyleChange = convertEditorToStyleChangeMap(visbugStyleChange)

	// For each key in mappedStyleChange,
	// if key does not exist in activity, add the oldVal and newVal.
	// if it does, only apply newVal
	Object.entries(mappedStyleChange).forEach(([key, val]) => {
		if (!activity.styleChanges[key]) {
			activity.styleChanges[key] = {
				key: key,
				oldVal: val.oldVal ?? '',
				newVal: val.newVal
			} as StyleChange
		} else {
			activity.styleChanges[key].newVal = val.newVal
		}
	})

	// Remove the style change in activity if the newVal is empty
	Object.entries(activity.styleChanges).forEach(([key, val]) => {
		if (!val.newVal) {
			delete activity.styleChanges[key]
		}
	})

	// If no style changes, remove activity
	if (Object.keys(activity.styleChanges).length === 0) {
		delete activeProject.activities[visbugStyleChange.selector]
		projectsMapBucket.set({ [activeProject.id]: activeProject })
		return
	}

	activity.path = visbugStyleChange.path ?? activity.path
	activity.createdAt = new Date().toISOString()
	activeProject.activities[visbugStyleChange.selector] = activity

	// Update project
	projectsMapBucket.set({ [activeProject.id]: activeProject })

	// Send to content script
	forwardToActiveProjectTab(activity, sendGetScreenshotRequest)
}
