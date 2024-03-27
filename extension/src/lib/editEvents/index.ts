import { EditType, type EditEvent } from '$shared/models/editor'
import { ActivityStatus, type Activity, type ChangeValues, type Component } from '$shared/models/activity'
import { convertEditEventToStyleChangeMap } from '$lib/utils/editEvents'
import { getActiveProject, getActiveUser, projectsMapBucket } from '$lib/utils/localstorage'
import { sendGetScreenshotRequest } from '$lib/utils/messaging'
import { forwardToActiveProjectTab } from '$extension/background/tabs'
import { nanoid } from 'nanoid'

export class EditEventService {
  changeQueue: EditEvent[] = []

  constructor() { }

  async handleEditEvent(editEvent: EditEvent) {
    this.changeQueue.push(editEvent)

    // Process the queue
    if (this.changeQueue.length === 1) {
      // Only start processing if this is the only item in the queue
      await this.processChangeQueue()
    }
  }
  async processChangeQueue() {
    while (this.changeQueue.length > 0) {
      const editEvent = this.changeQueue[0] // Get the first item from the queue without removing it
      await this.processEditEvent(editEvent) // Process it
      this.changeQueue.shift() // Remove the processed item from the queue
    }
  }

  async processEditEvent(editEvent: EditEvent) {
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
        updatedAt: new Date().toISOString(),
        status: ActivityStatus.EDITED,
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
        activity.styleChanges = this.getChangeObject(editEvent, activity.styleChanges)
        break
      case EditType.TEXT:
        activity.textChanges = this.getChangeObject(editEvent, activity.textChanges ?? {})
        break
      case EditType.COMPONENT:
        activity = this.handleComponentChange(editEvent, activity)
        break
      case EditType.REMOVE:
        activity = this.handleRemoveChange(editEvent, activity)
        break
    }

    // Remove activity if changes are empty
    if (this.isActivityEmpty(activity)) {
      delete activeProject.activities[editEvent.selector]
      projectsMapBucket.set({ [activeProject.id]: activeProject })
      return
    }

    activity.path = editEvent.path ?? activity.path
    activity.updatedAt = new Date().toISOString()
    activity.status = ActivityStatus.EDITED
    activeProject.activities[editEvent.selector] = activity

    // Update project
    projectsMapBucket.set({ [activeProject.id]: activeProject })

    // Send to content script
    forwardToActiveProjectTab(activity, sendGetScreenshotRequest)
  }


  getChangeObject(editEvent: EditEvent, changeObject: Record<string, ChangeValues>) {
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

  handleComponentChange(editEvent: EditEvent, activity: Activity) {
    // Insert new component

    return activity
  }

  handleRemoveChange(editEvent: EditEvent, activity: Activity) {
    // If removed in inserted component, remove it from list in activity
    const newVal = editEvent.newVal as Component
    if (activity.insertChanges && newVal.componentId && newVal.componentId in Object.keys(activity.insertChanges)) {
      delete activity.insertChanges[newVal.componentId]
    } else {
      // Add to delete change
      if (!activity.deleteChanges) activity.deleteChanges = {}
      activity.deleteChanges[newVal.selector] = newVal
    }
    return activity
  }


  isActivityEmpty(activity: Activity): boolean {
    return Object.keys(activity.styleChanges).length === 0
      && Object.keys(activity.textChanges ?? {}).length === 0
      && Object.keys(activity.insertChanges ?? {}).length === 0
  }
}