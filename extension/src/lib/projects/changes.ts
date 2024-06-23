import { getCSSFramework } from "$lib/utils/styleFramework";
import { convertChangeObjectToEditEvents, convertStructureChangeToEditEvents } from "$shared/helpers";

import { EditType, type Activity, type EditEvent, type Project } from "$shared/models";

export class ProjectChangeService {
    constructor() { }

    mergeProjects(currentProject: Project, targetProject: Project): Project {
        const currentActivities = currentProject.activities || {};
        const targetActivities = targetProject.activities || {};

        const mergedActivities = { ...targetActivities };

        Object.keys(currentActivities).forEach(activityKey => {
            const currentActivity = currentActivities[activityKey];
            const targetActivity = mergedActivities[activityKey] || {};


            // Merge style changes
            const currentStyles = currentActivity.styleChanges || {};
            const targetStyles = targetActivity.styleChanges || {};
            targetActivity.styleChanges = { ...targetStyles, ...currentStyles };

            // Merge text changes
            const currentTexts = currentActivity.textChanges || {};
            const targetTexts = targetActivity.textChanges || {};
            targetActivity.textChanges = { ...targetTexts, ...currentTexts };

            // Merge attribute changes
            const currentAttributes = currentActivity.attributeChanges || {};
            const targetAttributes = targetActivity.attributeChanges || {};
            targetActivity.attributeChanges = { ...targetAttributes, ...currentAttributes };

            mergedActivities[activityKey] = { ...currentActivity, ...targetActivity };
        });

        return {
            ...targetProject,
            updatedAt: currentProject.updatedAt,
            activities: mergedActivities
        };
    }

    async applyProjectChanges(project: Project, tab: chrome.tabs.Tab, revert: boolean = false): Promise<boolean> {
        if (!project) return false

        let shouldSaveProject = false

        const editEvents = this.getEditEventsFromProject(project)
        if (editEvents.length > 0) {

            shouldSaveProject = true
        }

        // Get each activity and their style change
        Object.values(project.activities).forEach(activity => {
            let activityMutated = this.updateActivityPath(activity)
            if (activityMutated) {
                project.activities[activity.selector] = activity
                shouldSaveProject = true
            }
        })

        // Get style framework if did not exist
        if (!project.projectSettings?.styleFramework) {
            const styleFramework = await getCSSFramework()
            project.projectSettings = {
                ...project.projectSettings,
                styleFramework
            }
            shouldSaveProject = true
        }

        return shouldSaveProject
    }

    getEditEventsFromProject(project: Project): EditEvent[] {
        const editEvents: EditEvent[] = []
        for (const activity of Object.values(project.activities)) {
            editEvents.push(...this.getEditEventsFromActivity(activity))
        }
        return editEvents
    }

    updateActivityPath(activity: Activity): boolean {
        // Update path if possible
        const element = document.querySelector(activity.selector) as any
        if (element) {
            if (activity.path !== element.dataset.onlookId) {
                activity.path = element.dataset.onlookId
                return true
            }
        }
        return false
    }

    getEditEventsFromActivity(activity: Activity): EditEvent[] {
        const editEvents: EditEvent[] = []
        for (const [key, changeValues] of Object.entries(activity.styleChanges)) {
            const event = convertChangeObjectToEditEvents(activity.selector, EditType.STYLE, { [key]: changeValues })
            editEvents.push(...event)
        }
        if (activity.textChanges) {
            for (const [key, changeValues] of Object.entries(activity.textChanges)) {
                const event = convertChangeObjectToEditEvents(activity.selector, EditType.TEXT, { [key]: changeValues })
                editEvents.push(...event)
            }
        }
        if (activity.attributeChanges) {
            for (const [key, changeValues] of Object.entries(activity.attributeChanges)) {
                const event = convertChangeObjectToEditEvents(activity.selector, EditType.CLASS, { [key]: changeValues })
                editEvents.push(...event)
            }
        }
        if (activity.insertChildChanges) {
            for (const [key, changeValues] of Object.entries(activity.insertChildChanges)) {
                const event = convertStructureChangeToEditEvents(activity.selector, EditType.INSERT_CHILD, { [key]: changeValues })
                editEvents.push(...event)
            }
        }
        if (activity.deleteChildChanges) {
            for (const [key, changeValues] of Object.entries(activity.deleteChildChanges)) {
                const event = convertStructureChangeToEditEvents(activity.selector, EditType.REMOVE_CHILD, { [key]: changeValues })
                editEvents.push(...event)
            }
        }
        if (activity.moveChildChanges) {
            for (const [key, changeValues] of Object.entries(activity.moveChildChanges)) {
                const event = convertStructureChangeToEditEvents(activity.selector, EditType.MOVE_CHILD, { [key]: changeValues })
                editEvents.push(...event)
            }
        }

        // Order events chronologically
        editEvents.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
        return editEvents
    }
}