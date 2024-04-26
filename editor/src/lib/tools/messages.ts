import { MessageTypes } from "$shared/constants";
import type { EditEvent } from "$shared/models";

export function emitOpenProjectMessage() {
  window.postMessage({ type: MessageTypes.OPEN_PROJECT }, window.location.origin);
};

export function emitEditEvent(event: EditEvent) {
  const message = {
    type: MessageTypes.EDIT_EVENT,
    detail: event,
  }
  window.postMessage(message, window.location.origin);
}