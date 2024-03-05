import { EditType, type EditEvent } from '$shared/models/editor'
import type { Activity, ChangeValues } from '$shared/models/activity'
import { convertEditEventToStyleChangeMap } from '$shared/translation'
import { getActiveProject, getActiveUser, projectsMapBucket } from '$lib/utils/localstorage'
import { sendGetScreenshotRequest } from '$lib/utils/messaging'
import { forwardToActiveProjectTab } from './tabs'
import { nanoid } from 'nanoid'

export let changeQueue: EditEvent[] = []

export async function processChangeQueue() {
	while (changeQueue.length > 0) {
		const editEvent = changeQueue[0] // Get the first item from the queue without removing it
		await processEditEvent(editEvent) // Process it
		changeQueue.shift() // Remove the processed item from the queue
	}
}

async function processEditEvent(editEvent: EditEvent) {
	console.log('Processing edit event', editEvent)
	const activeProject = await getActiveProject()
	if (!activeProject) return

	let activity = activeProject.activities[editEvent.selector]

	// Create activity if it doesn't exist
	if (!activity) {
		const user = await getActiveUser()
		activity = {
			id: nanoid(),
			userId: user.id,
			projectId: activeProject.id,
			eventData: [],
			createdAt: new Date().toISOString(),
			selector: editEvent.selector,
			path: editEvent.path,
			styleChanges: {},
			textChange: {},
			insertChange: {},
			deleteChange: {},
			visible: true
		} as Activity
	}

	switch (editEvent.editType) {
		case EditType.STYLE:
			activity.styleChanges = getChangeObject(editEvent, activity.styleChanges)
			break
		case EditType.TEXT:
			activity.textChanges = getChangeObject(editEvent, activity.textChanges ?? {})
			break
		case EditType.INSERT:
			activity.insertChanges = getChangeObject(editEvent, activity.insertChanges ?? {})
			break
		case EditType.REMOVE:
			activity.removeChanges = getChangeObject(editEvent, activity.removeChanges ?? {})
			break
	}

	console.log('Processed edit event', editEvent, activity)

	// Remove activity if changes are empty
	if (isActivityEmpty(activity)) {
		delete activeProject.activities[editEvent.selector]
		projectsMapBucket.set({ [activeProject.id]: activeProject })
		return
	}

	activity.path = editEvent.path ?? activity.path
	activity.createdAt = new Date().toISOString()
	activeProject.activities[editEvent.selector] = activity

	// Update project
	projectsMapBucket.set({ [activeProject.id]: activeProject })

	// Send to content script
	forwardToActiveProjectTab(activity, sendGetScreenshotRequest)
}

function isActivityEmpty(activity: Activity): boolean {
	return Object.keys(activity.styleChanges).length === 0
		&& Object.keys(activity.textChanges ?? {}).length === 0
		&& Object.keys(activity.insertChanges ?? {}).length === 0
		&& Object.keys(activity.removeChanges ?? {}).length === 0
}

// TODO: This may change for different EditEvent EditType. Same for now
function getChangeObject(editEvent: EditEvent, changeObject: Record<string, ChangeValues>) {
	const mappedStyleChange = convertEditEventToStyleChangeMap(editEvent)

	// For each key in mappedStyleChange,
	// if key does not exist in activity, add the oldVal and newVal.
	// if it does, only apply newVal
	Object.entries(mappedStyleChange).forEach(([key, val]) => {
		if (!changeObject[key]) {
			changeObject[key] = {
				key: key,
				oldVal: val.oldVal ?? '',
				newVal: val.newVal
			} as ChangeValues
		} else {
			changeObject[key].newVal = val.newVal
		}
	})

	// Remove the style change in activity if the newVal is empty
	Object.entries(changeObject).forEach(([key, val]) => {
		if (!val.newVal) {
			delete changeObject[key]
		}
	})
	return changeObject
}