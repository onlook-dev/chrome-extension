import { getActiveUser, projectsMapBucket } from '$lib/utils/localstorage'
import { nanoid } from 'nanoid'
import { convertEditEventToChangeObject } from './convert'
import { EditType, ActivityStatus, ProjectStatus } from '$shared/models'

import type { Project, EditEvent, Activity, } from '$shared/models'
import type { ProjectTabService } from '$lib/projects'

interface QueueItem {
  tab: chrome.tabs.Tab
  editEvent: EditEvent
}

export class EditEventService {
  changeQueue: QueueItem[] = []
  constructor(private projectTabManager: ProjectTabService) { }

  async handleEditEvent(editEvent: EditEvent, tab: chrome.tabs.Tab) {
    this.changeQueue.push({ editEvent, tab })

    // Process the queue
    if (this.changeQueue.length === 1) {
      // Only start processing if this is the only item in the queue
      while (this.changeQueue.length > 0) {
        await this.processEditEvent(this.changeQueue[0]) // Process it
        this.changeQueue.shift() // Remove the processed item from the queue
      }
    }
  }

  private async processEditEvent({ tab, editEvent }: QueueItem) {
    // Get active project
    const activeProject = await this.projectTabManager.getTabProject(tab)
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
    activeProject.status = ProjectStatus.DRAFT
    activeProject.updatedAt = new Date().toISOString()
    projectsMapBucket.set({ [activeProject.id]: activeProject })
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
        snapshot: editEvent.snapshot,
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
    switch (editEvent.editType) {
      // Element attribute changes
      case EditType.STYLE:
        activity.styleChanges = convertEditEventToChangeObject(editEvent, activity.styleChanges)
        break
      case EditType.TEXT:
        activity.textChanges = convertEditEventToChangeObject(editEvent, activity.textChanges ?? {})
        break
      case EditType.CLASS:
        activity.attributeChanges = convertEditEventToChangeObject(editEvent, activity.attributeChanges ?? {})
        break
      // Structural changes
      case EditType.INSERT:
        activity = this.handleInsertChange(editEvent, activity)
        break
      case EditType.REMOVE:
        activity = this.handleRemoveChange(editEvent, activity)
        break
      case EditType.MOVE:
        activity = this.handleMoveChange(editEvent, activity)
        break
      default:
        console.error('Edit type not supported: ', editEvent.editType)
        break
    }

    // If componentId exists, handle the custom element
    if (editEvent.componentId) {

    }

    activity.path = editEvent.path ?? activity.path
    activity.updatedAt = new Date().toISOString()
    activity.status = ActivityStatus.EDITED
    return activity
  }

  handleInsertChange(editEvent: EditEvent, activity: Activity) {
    console.log("Insert change", editEvent)
    /**
     * Save as new element in activity. Store raw string.
     */

    activity.insertChanges = {
      ...activity.insertChanges,
      [editEvent.selector]: editEvent.newVal
    }

    console.log("Insert changes", activity.insertChanges)
    return activity
  }

  handleRemoveChange(editEvent: EditEvent, activity: Activity) {
    console.log("Remove change", editEvent)
    /**
    * If an inserted component, remove the insert change
    */
    if (activity.insertChanges && activity.insertChanges[editEvent.selector]) {
      delete activity.insertChanges[editEvent.selector]
    }

    console.log("Insert changes", activity.insertChanges)
    console.log("Delete changes", activity.deleteChanges)
    return activity
  }

  handleMoveChange(editEvent: EditEvent, activity: Activity) {
    console.log("Move change", editEvent)
    /**
    * If an inserted component, update the insert change
    */
    if (activity.insertChanges && activity.insertChanges[editEvent.selector]) {
      activity.insertChanges[editEvent.selector] = {
        ...activity.insertChanges[editEvent.selector],
        ...editEvent.newVal
      }
    }
    console.log("Insert changes", activity.insertChanges)
    console.log("Move changes", activity.moveChanges)
    return activity
  }


  isActivityEmpty(activity: Activity): boolean {
    return Object.keys(activity.styleChanges).length === 0
      && Object.keys(activity.textChanges ?? {}).length === 0
      && Object.keys(activity.attributeChanges ?? {}).length === 0
      && Object.keys(activity.insertChanges ?? {}).length === 0
  }
}