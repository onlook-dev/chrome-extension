import { ProjectChangeService } from "$lib/project"
import { MessageType } from "$shared/message"
import type { Project } from "$shared/models"
import { onMessage } from "webext-bridge/window"

export class EventListenerService {
    constructor() { }

    listen() {
        onMessage(MessageType.APPLY_PROJECT_CHANGE, async ({ data }) => {
            const project: Project = data as any
            const { project: updatedProject, shouldSaveProject } = await new ProjectChangeService().applyProjectChanges(project)

            // Should send mutated project
            // if (shouldSaveProject)
            //     sendMessage(MessageType.PUBLISH_PROJECT, updatedProject as any)
        })
    }
}