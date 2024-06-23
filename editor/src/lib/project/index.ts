import { applyEvent, createReverseEvent } from "$lib/tools/edit/history";
import { convertChangeObjectToEditEvents, convertStructureChangeToEditEvents } from "$shared/helpers";
import { StyleFramework } from "$shared/models";

import { EditType, type Activity, type EditEvent, type Project } from "$shared/models";

export class ProjectChangeService {
    constructor() { }

    async applyProjectChanges(project: Project, revert: boolean = false): Promise<{ project: Project, shouldSaveProject: boolean }> {
        let shouldSaveProject = false
        if (!project) return { project, shouldSaveProject }

        const editEvents = this.getEditEventsFromProject(project)
        if (editEvents.length > 0) {
            editEvents.forEach(event => {
                revert ? applyEvent(createReverseEvent(event), false) : applyEvent(event, false)
            })
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
            const styleFramework = await this.getCSSFramework()
            project.projectSettings = {
                ...project.projectSettings,
                styleFramework
            }
            shouldSaveProject = true
        }

        return { project, shouldSaveProject }
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

    getEditEventsFromProject(project: Project): EditEvent[] {
        const editEvents: EditEvent[] = []
        for (const activity of Object.values(project.activities)) {
            editEvents.push(...this.getEditEventsFromActivity(activity))
        }
        return editEvents
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

    async isTailwindUsed() {
        // Function to fetch and read the content of a stylesheet
        async function fetchStylesheet(href: string) {
            try {
                const response = await fetch(href);
                return await response.text();
            } catch (error) {
                console.error('Error fetching the stylesheet:', error);
                return '';
            }
        }

        // Get all stylesheet links on the page
        const links = Array.from(document.querySelectorAll('link[rel="stylesheet"]')) as HTMLLinkElement[];

        // Check each stylesheet for Tailwind CSS patterns
        for (let link of links) {
            if (!link.href) continue; // Skip if no href attribute
            const content = await fetchStylesheet(link.href);
            // Look for a Tailwind CSS signature pattern
            if (content.includes('tailwindcss') || content.includes('@tailwind')) {
                return true; // Tailwind CSS pattern found
            }
        }

        return false; // No Tailwind CSS patterns found in any stylesheet
    }

    async getCSSFramework(): Promise<StyleFramework | undefined> {
        try {
            if (await this.isTailwindUsed()) {
                return StyleFramework.TailwindCSS;
            } else {
                return StyleFramework.InlineCSS;
            }
        } catch (error) {
            console.error('Error detecting the CSS framework:', error);
            return undefined;
        }
    }
}