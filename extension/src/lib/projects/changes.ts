import { EditEventService } from "$lib/editEvents";
import { getCSSFramework } from "$lib/utils/styleFramework";
import { MessageService, MessageType } from "$shared/message";

import type { Activity, Project } from "$shared/models";

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

    applyActivityChanges(activity: Activity): boolean {
        const element = document.querySelector(activity.selector) as any
        if (element) {
            if (activity.path !== element.dataset.onlookId) {
                activity.path = element.dataset.onlookId
                return true
            }
        }

        // TODO: Create edit event and send apply
=        MessageService.getInstance().publish(MessageType.APPLY_EDIT_EVENT, activity)
        return false
    }

}