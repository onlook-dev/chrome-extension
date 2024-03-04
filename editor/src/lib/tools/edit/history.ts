import type { EditEvent } from '$lib/types/editor';
import { writable } from 'svelte/store';

export const historyStore = writable<EditEvent[]>([]);
export const redoStore = writable<EditEvent[]>([]);

export function addToHistory(event: EditEvent) {
  // Merge to last item if styleType, selector and keys are the same
  // Keeping oldest old val and newest new val
  historyStore.update((history) => {
    if (history.length === 0) return [event];

    // Deduplicate last event
    const lastEvent = history[history.length - 1];

    if (
      lastEvent.editType === event.editType &&
      lastEvent.selector === event.selector
    ) {
      lastEvent.newVal = event.newVal;
      lastEvent.createdAt = event.createdAt;
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
        createdAt: event.createdAt,
        selector: event.selector,
        editType: event.editType,
        newVal: event.oldVal,
        oldVal: event.newVal,
        path: event.path,
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
      applyEvent(event);
      historyStore.update(history => [...history, event]);
    }
    return redo;
  });
}

function applyEvent(event: EditEvent) {
  const element: HTMLElement | undefined = document.querySelector(event.selector);
  if (!element) return;
  Object.entries(event.newVal).forEach(([style, newVal]) => {
    if (style === 'text') {
      element.innerText = newVal
    } else {
      element.style[style] = newVal;
    }
  });
  window.postMessage(event, window.location.origin);
}
