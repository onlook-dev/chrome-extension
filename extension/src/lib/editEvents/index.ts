import { getActiveUser, projectsMapBucket } from '$lib/utils/localstorage'
import { nanoid } from 'nanoid'
import { convertEditEventToChangeObject } from './convert'
import { EditType, ActivityStatus, ProjectStatus } from '$shared/models'

import type { Project, EditEvent, Activity, StructureVal, ChangeValues, } from '$shared/models'
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
      case EditType.INSERT_CHILD:
        activity = { ...this.handleInsertChange(editEvent, activity) }
        break
      case EditType.REMOVE_CHILD:
        activity = { ...this.handleRemoveChange(editEvent, activity) }
        break
      case EditType.MOVE_CHILD:
        activity = { ...this.handleMoveChange(editEvent, activity) }
        break
      default:
        console.error('Edit type not supported: ', editEvent.editType)
        break
    }

    activity.path = editEvent.path ?? activity.path
    activity.updatedAt = new Date().toISOString()
    activity.status = ActivityStatus.EDITED
    return activity
  }

  handleInsertChange(editEvent: EditEvent, activity: Activity) {
    /**
     * Save as new element in activity. Store raw string.
     */
    const newVal = { ...editEvent.newVal } as StructureVal
    activity.insertChildChanges = {
      ...activity.insertChildChanges,
      [newVal.childSelector]: {
        key: editEvent.selector,
        oldVal: { ...editEvent.oldVal } as StructureVal,
        newVal: { ...editEvent.newVal } as StructureVal,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      } as ChangeValues
    }
    return activity
  }

  handleRemoveChange(editEvent: EditEvent, activity: Activity) {
    /**
    * If the remove element is an inserted component, remove it from insertChildChanges
    * Else, add as a new deleteChildChange
    */
    const newVal = { ...editEvent.newVal } as StructureVal
    const childSelector = newVal.childSelector
    if (activity.insertChildChanges && activity.insertChildChanges[childSelector]) {
      delete activity.insertChildChanges[childSelector]
    } else if (newVal.componentId) {
      // Don't record if inserted component. Note: When we start writing to code, be sure to remove componentId.
    } else {
      if (!activity.deleteChildChanges) {
        activity.deleteChildChanges = {}
      }
      activity.deleteChildChanges = {
        ...activity.deleteChildChanges,
        [childSelector]: {
          key: editEvent.selector,
          oldVal: { ...editEvent.oldVal } as StructureVal,
          newVal: { ...editEvent.newVal } as StructureVal,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        } as ChangeValues
      }
    }
    return activity
  }

  handleMoveChange(editEvent: EditEvent, activity: Activity) {
    /**
     * If the moved element is an inserted component, update the element's position in insertChildChanges
     * Update the moved element changes list using a finalMovePosition list to reduce redundant moves
    */

    const newVal = { ...editEvent.newVal } as StructureVal;
    const oldVal = { ...editEvent.oldVal } as StructureVal;
    const childSelector = newVal.childSelector;

    // Initialize the storage for final move positions if not already present
    if (!activity.finalMovePositions) {
      activity.finalMovePositions = {};
    }

    // Check if this is related to an inserted component
    if (activity.insertChildChanges && activity.insertChildChanges[childSelector]) {
      // Update inserted component index
      (activity.insertChildChanges[childSelector].newVal as StructureVal).index = newVal.index;
      (activity.insertChildChanges[childSelector]).updatedAt = new Date().toISOString();
    } else if (activity.moveChildChanges && activity.moveChildChanges[childSelector]) {
      // Existing move update
      const existingMove = activity.finalMovePositions[childSelector];
      if (existingMove && existingMove.newIndex === oldVal.index) {
        // If the new move is a reversal of the previous move, cancel it
        delete activity.finalMovePositions[childSelector];
        delete activity.moveChildChanges[childSelector];
      } else {
        // Update the move to reflect the latest intended position
        activity.finalMovePositions[childSelector] = {
          originalIndex: existingMove ? existingMove.originalIndex : oldVal.index,
          newIndex: newVal.index
        };
      }
    } else {
      // New move
      activity.finalMovePositions[childSelector] = {
        originalIndex: oldVal.index,
        newIndex: newVal.index
      };
    }

    // Rebuild the moveChildChanges from finalMovePositions for output
    activity.moveChildChanges = {};

    for (let selector in activity.finalMovePositions) {
      const move = activity.finalMovePositions[selector];
      activity.moveChildChanges[selector] = {
        key: selector,
        oldVal: { ...oldVal, index: move.originalIndex },
        newVal: { ...newVal, index: move.newIndex },
        updatedAt: new Date().toISOString(),
      } as ChangeValues;
    }
    return activity;
  }

  isActivityEmpty(activity: Activity): boolean {
    return Object.keys(activity.styleChanges).length === 0
      && Object.keys(activity.textChanges ?? {}).length === 0
      && Object.keys(activity.attributeChanges ?? {}).length === 0
      && Object.keys(activity.insertChildChanges ?? {}).length === 0
      && Object.keys(activity.deleteChildChanges ?? {}).length === 0
      && Object.keys(activity.moveChildChanges ?? {}).length === 0
  }
}