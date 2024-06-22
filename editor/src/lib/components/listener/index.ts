import { applyEvent, createReverseEvent } from "$lib/tools/edit/history"
import { MessageType } from "$shared/message"
import type { EditEvent } from "$shared/models"
import { onMessage } from "webext-bridge/window"

export class EventListenerService {
    constructor() { }

    listen() {
        onMessage(MessageType.APPLY_EDIT_EVENTS, ({ data }) => {
            const { events, revert } = data as { events: EditEvent[], revert: boolean }
            events.forEach(event => {
                revert ? applyEvent(createReverseEvent(event), false) : applyEvent(event, false)
            })
        })
    }
}