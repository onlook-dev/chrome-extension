import type { EditEvent } from '$lib/types/editor';
import { get, writable } from 'svelte/store';

export const historyStore = writable<EditEvent[]>([]);
export const redoStore = writable<EditEvent[]>([]);


let historyStack = [];
let redoStack = [];
const UNDO_STYLE_CHANGE = "UNDO_STYLE_CHANGE";
const REDO_STYLE_CHANGE = "REDO_STYLE_CHANGE";

export function addToHistory(event: EditEvent) {
  // Merge to last item if styleType, selector and keys are the same
  // Keeping oldest old val and newest new val
  let lastEvent = peek();
  if (
    lastEvent &&
    lastEvent.detail.styleType === event.detail.styleType &&
    lastEvent.detail.selector === event.detail.selector
  ) {
    lastEvent.detail.newVal = event.detail.newVal;
  } else {
    historyStack.push(event);
    historyStore.update((store) => {
      store.push(event);
      return store;
    });
  }
}

export function undoLastEvent() {
  historyStore.update(history => {
    const event = history.pop();
    if (event) {
      const reverseEvent = {
        type: UNDO_STYLE_CHANGE,
        detail: {
          selector: event.detail.selector,
          styleType: event.detail.styleType,
          newVal: event.detail.oldVal,
          oldVal: event.detail.newVal,
          path: event.detail.path,
        },
      };
      window.postMessage(reverseEvent, window.location.origin);
      redoStore.update(redo => [...redo, event]);
    }
    return history;
  });
}

export function redoLastEvent() {
  redoStore.update(redo => {
    const event = redo.pop();
    if (event) {
      event.type = REDO_STYLE_CHANGE;
      window.postMessage(event, window.location.origin);
      historyStore.update(history => [...history, event]);
    }
    return redo;
  });
}

function peek() {
  return historyStack[historyStack.length - 1];
}