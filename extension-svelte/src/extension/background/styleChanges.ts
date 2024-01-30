import type { VisbugStyleChange } from '$shared/models/visbug'
import type { Activity, StyleChange } from '$shared/models/activity'

import { convertVisbugToStyleChangeMap } from '$shared/helpers'
import { nanoid } from 'nanoid'
import { getActiveProject, getActiveUser, projectsMapBucket } from '$lib/utils/localstorage'

export let changeQueue: VisbugStyleChange[] = []

export async function processChangeQueue() {
	while (changeQueue.length > 0) {
		const visbugStyleChange = changeQueue[0] // Get the first item from the queue without removing it
		await processStyleChange(visbugStyleChange) // Process it
		changeQueue.shift() // Remove the processed item from the queue
	}
}

async function processStyleChange(visbugStyleChange: VisbugStyleChange) {
	console.log('Style change', visbugStyleChange)
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
			visible: true
		} as Activity
	}

	const mappedStyleChange = convertVisbugToStyleChangeMap(visbugStyleChange)

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

	activity.path = visbugStyleChange.path ?? activity.path
	activity.createdAt = new Date().toISOString()
	activeProject.activities[visbugStyleChange.selector] = activity

	// Update project
	projectsMapBucket.set({ [activeProject.id]: activeProject })
}
