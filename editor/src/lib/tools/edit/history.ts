import { EditType, type EditEvent, type TextVal, type InsertRemoveVal } from '$lib/types/editor';
import { writable } from 'svelte/store';
import { emitEditEvent } from '../messages';

export const historyStore = writable<EditEvent[]>([]);
export const redoStore = writable<EditEvent[]>([]);

function compareKeys(a: Record<string, string>, b: Record<string, string>): boolean {
  if (!a || !b) return false;
  const set1 = new Set(Object.keys(a));
  const set2 = new Set(Object.keys(b));
  if (set1.size !== set2.size) return false;
  for (let item of set1) {
    if (!set2.has(item)) return false;
  }
  return true;
}

export function addToHistory(event: EditEvent) {
  // Merge to last item if type, selector and keys are the same
  // Keeping oldest old val and newest new val
  historyStore.update((history) => {
    if (history.length === 0) return [event];

    // Deduplicate last event
    const lastEvent = history[history.length - 1];
    if (
      lastEvent.editType !== EditType.INSERT &&
      lastEvent.editType === event.editType &&
      lastEvent.selector === event.selector &&
      compareKeys(lastEvent.newVal as Record<string, string>, event.newVal as Record<string, string>)
    ) {
      lastEvent.newVal = event.newVal;
      lastEvent.createdAt = event.createdAt;
      history[history.length - 1] = lastEvent;
      return history;
    } else {
      return [...history, event];
    }
  });
}

export function undoLastEvent() {
  historyStore.update(history => {
    if (history.length === 0) {
      return history;
    }
    const lastEvent = history[history.length - 1];
    if (lastEvent) {
      const reverseEvent: EditEvent = createReverseEvent(lastEvent);
      applyEvent(reverseEvent);
      redoStore.update(redo => [...redo, lastEvent]);
    }
    return history.slice(0, -1);
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

function createReverseEvent(event: EditEvent): EditEvent {
  switch (event.editType) {
    case EditType.INSERT:
      return {
        createdAt: event.createdAt,
        selector: event.selector,
        editType: EditType.REMOVE,
        newVal: event.oldVal,
        oldVal: event.newVal,
        path: event.path,
      } as EditEvent;
    case EditType.REMOVE:
      return {
        createdAt: event.createdAt,
        selector: event.selector,
        editType: EditType.INSERT,
        newVal: event.oldVal,
        oldVal: event.newVal,
        path: event.path,
      } as EditEvent;
    case EditType.STYLE || EditType.TEXT:
    default:
      return {
        createdAt: event.createdAt,
        selector: event.selector,
        editType: event.editType,
        newVal: event.oldVal,
        oldVal: event.newVal,
        path: event.path,
      } as EditEvent;
  }
}

function applyStyleEvent(event: EditEvent, element: HTMLElement) {
  if (!element) return;
  Object.entries(event.newVal).forEach(([style, newVal]) => {
    element.style[style] = newVal;
  });
}

function applyTextEvent(event: EditEvent, element: HTMLElement) {
  if (!element) return;
  const newVal = event.newVal as TextVal;
  element.textContent = newVal.text;
}

function applyInsertEvent(event: EditEvent, parent: HTMLElement) {
  const newVal = event.newVal as InsertRemoveVal;
  if (!parent) return;
  const parser = new DOMParser();
  const doc = parser.parseFromString(newVal.childContent, "application/xml");
  const el = doc.documentElement
  if (!el) return;
  const pos = parseInt(newVal.position);
  if (pos >= parent.childNodes.length) {
    parent.insertBefore(el, parent.childNodes[pos]);
  } else {
    parent.appendChild(el);
  }
}

function applyRemoveEvent(event: EditEvent, parent: HTMLElement) {
  const oldVal = event.oldVal as InsertRemoveVal;
  const el = parent.querySelector(oldVal.childSelector);
  if (el) el.remove();
}

function applyEvent(event: EditEvent) {
  const element: HTMLElement | undefined = document.querySelector(event.selector);
  switch (event.editType) {
    case EditType.STYLE:
      applyStyleEvent(event, element);
      break;
    case EditType.TEXT:
      applyTextEvent(event, element);
      break;
    case EditType.INSERT:
      applyInsertEvent(event, element);
      break;
    case EditType.REMOVE:
      applyRemoveEvent(event, element);
      break;
  }

  emitEditEvent(event);
}
