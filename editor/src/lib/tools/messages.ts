import type { EditEvent, } from "$shared/models/editor";

const OPEN_PROJECT: string = "OPEN_PROJECT";
const EDIT_EVEMT: string = "EDIT_EVENT";

export function emitOpenProjectMessage() {
  window.postMessage({ type: OPEN_PROJECT }, window.location.origin);
};

export function emitEditEvent(event: EditEvent) {
  const message = {
    type: EDIT_EVEMT,
    detail: event,
  }
  window.postMessage(message, window.location.origin);
}