import { EditType, type EditEvent } from '$shared/models/editor'
import { ActivityStatus, type Activity, type Component } from '$shared/models/activity'
import { getActiveProject, getActiveUser, projectsMapBucket } from '$lib/utils/localstorage'
import { sendGetScreenshotRequest } from '$lib/utils/messaging'
import { nanoid } from 'nanoid'
import type { Project } from '$shared/models/project'
import { convertEditEventToChangeObject } from './convert'
export class EditEventService {
  changeQueue: EditEvent[] = []

  constructor(private forwardToActiveProjectTab: (activity: Activity, callback: (activity: Activity) => void) => void) { }

  async handleEditEvent(editEvent: EditEvent) {
    this.changeQueue.push(editEvent)

    // Process the queue
    if (this.changeQueue.length === 1) {
      // Only start processing if this is the only item in the queue
      while (this.changeQueue.length > 0) {
        const editEvent = this.changeQueue[0] // Get the first item from the queue without removing it
        await this.processEditEvent(editEvent) // Process it
        this.changeQueue.shift() // Remove the processed item from the queue
      }
    }
  }

  async processEditEvent(editEvent: EditEvent) {
    // Get active project
    const activeProject = await getActiveProject()
    if (!activeProject) return

    // Get and update activity
    let activity = await this.getOrCreateActivityFromEditEvent(activeProject, editEvent)
    activity = this.updateActivityWithEditEvent(activity, editEvent)

    // Remove activity if changes are empty after update
    if (this.isActivityEmpty(activity)) {
      delete activeProject.activities[editEvent.selector]
      projectsMapBucket.set({ [activeProject.id]: activeProject })
      return
    }

    // Update and save project
    activeProject.activities[editEvent.selector] = activity
    projectsMapBucket.set({ [activeProject.id]: activeProject })

    // Send to content script
    this.forwardToActiveProjectTab(activity, sendGetScreenshotRequest)
  }

  async getOrCreateActivityFromEditEvent(project: Project, editEvent: EditEvent): Promise<Activity> {
    let activity = project.activities[editEvent.selector]
    // Create activity if it doesn't exist
    if (!activity) {
      const user = await getActiveUser()
      activity = {
        id: nanoid(),
        userId: user.id,
        projectId: project.id,
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
    return activity
  }

  updateActivityWithEditEvent(activity: Activity, editEvent: EditEvent): Activity {
    // Update activity
    switch (editEvent.editType) {
      case EditType.STYLE:
        activity.styleChanges = convertEditEventToChangeObject(editEvent, activity.styleChanges)
        break
      case EditType.TEXT:
        activity.textChanges = convertEditEventToChangeObject(editEvent, activity.textChanges ?? {})
        break
      case EditType.COMPONENT:
        activity = this.handleComponentChange(editEvent, activity)
        break
      case EditType.REMOVE:
        activity = this.handleRemoveChange(editEvent, activity)
        break
    }
    activity.path = editEvent.path ?? activity.path
    activity.updatedAt = new Date().toISOString()
    activity.status = ActivityStatus.EDITED
    return activity
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