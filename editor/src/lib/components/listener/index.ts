import { ApplyChangesService } from "$lib/tools/edit/applyChange"
import { applyEvent, createReverseEvent } from "$lib/tools/edit/history"
import { MessageService, MessageType } from "$shared/message"
import type { EditEvent } from "$shared/models"

export class EventListenerService {
    constructor() { }

    listen() {
        MessageService.getInstance().subscribe(MessageType.APPLY_EDIT_EVENTS, (events: EditEvent[]) => {
            events.forEach(event => {
                applyEvent(event, false)
            })
        })

        MessageService.getInstance().subscribe(MessageType.REVERT_EDIT_EVENTS, (events: EditEvent[]) => {
            events.forEach(event => {
                applyEvent(createReverseEvent(event), false)
            })
        })
    }
}