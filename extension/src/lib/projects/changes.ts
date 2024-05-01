import { convertChangeObjectToEditEvents } from "$lib/editEvents/convert";
import { getCSSFramework } from "$lib/utils/styleFramework";
import { MessageService, MessageType } from "$shared/message";

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


    async applyProjectChanges(project: Project): Promise<boolean> {
        if (!project) return false

        let shouldSaveProject = false

        // Get each activity and their style change
        Object.values(project.activities).forEach(activity => {
            let activityMutated = this.applyActivityChanges(activity)
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

    revertActivityChanges(activity: Activity) {
        const editEvents: EditEvent[] = this.getEditEventsFromActivity(activity)
        MessageService.getInstance().publish(MessageType.REVERT_EDIT_EVENTS, editEvents)
    }

    applyActivityChanges(activity: Activity): boolean {
        const editEvents: EditEvent[] = this.getEditEventsFromActivity(activity)
        MessageService.getInstance().publish(MessageType.APPLY_EDIT_EVENTS, editEvents)

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
        return editEvents
    }
}