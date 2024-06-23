import { applyEvent, createReverseEvent } from "$lib/tools/edit/history"
import { MessageType } from "$shared/message"
import type { EditEvent, Project } from "$shared/models"
import { onMessage } from "webext-bridge/window"

export class EventListenerService {
    constructor() { }

    listen() {
        onMessage(MessageType.APPLY_EDIT_EVENTS, ({ data }) => {
            const { events, revert } = data as { events: EditEvent[], revert: boolean }
            console.log("Applying edit events", events, revert)
            events.forEach(event => {
                revert ? applyEvent(createReverseEvent(event), false) : applyEvent(event, false)
            })
        })

        onMessage(MessageType.APPLY_PROJECT_CHANGE, ({ data }) => {
            const project: Project = data as any
            console.log("Applying project change", project)
        })
    }
}