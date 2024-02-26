import type { EditEvent } from '$lib/types/editor';
import { writable } from 'svelte/store';

export const historyStore = writable<EditEvent[]>([]);
export const redoStore = writable<EditEvent[]>([]);

const UNDO_STYLE_CHANGE = "UNDO_STYLE_CHANGE";
const REDO_STYLE_CHANGE = "REDO_STYLE_CHANGE";

export function addToHistory(event: EditEvent) {
  // Merge to last item if styleType, selector and keys are the same
  // Keeping oldest old val and newest new val
  historyStore.update((history) => {
    if (history.length === 0) return [event];

    // Deduplicate last event
    const lastEvent = history[history.length - 1];

    if (
      lastEvent.detail.styleType === event.detail.styleType &&
      lastEvent.detail.selector === event.detail.selector
    ) {
      lastEvent.detail.newVal = event.detail.newVal;
      lastEvent.detail.createdAt = event.detail.createdAt;
      return history;
    } else {
      return [...history, event];
    }
  });
}

export function undoLastEvent() {
  historyStore.update(history => {
    const event: EditEvent = history.pop();
    if (event) {
      const reverseEvent: EditEvent = {
        type: UNDO_STYLE_CHANGE,
        detail: {
          createdAt: event.detail.createdAt,
          selector: event.detail.selector,
          styleType: event.detail.styleType,
          newVal: event.detail.oldVal,
          oldVal: event.detail.newVal,
          path: event.detail.path,
        },
      };
      applyEvent(reverseEvent);
      redoStore.update(redo => [...redo, event]);
    }
    return history;
  });
}

export function redoLastEvent() {
  redoStore.update((redo) => {
    const event: EditEvent = redo.pop();
    if (event) {
      event.type = REDO_STYLE_CHANGE;
      applyEvent(event);
      historyStore.update(history => [...history, event]);
    }
    return redo;
  });
}

function applyEvent(event: EditEvent) {
  const detail = event.detail;
  const element: HTMLElement | undefined = document.querySelector(detail.selector);
  if (!element) return;
  Object.entries(detail.newVal).forEach(([style, newVal]) => {
    if (style === 'text') {
      element.innerText = newVal
    } else {
      element.style[style] = newVal;
    }
  });
  window.postMessage(event, window.location.origin);
}
