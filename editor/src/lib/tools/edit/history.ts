import { EditType, type EditEvent, type TextVal, type InsertRemoveVal } from '$shared/models';
import { get, writable } from 'svelte/store';
import { MessageService, MessageType } from '$shared/message';
import { ApplyChangesService } from './applyChange';

import type { MoveVal } from '$shared/models/editor';

import Sortable from 'sortablejs';

export const historyStore = writable<EditEvent[]>([]);
export const redoStore = writable<EditEvent[]>([]);
const messageService = MessageService.getInstance();
const applyChangeService = new ApplyChangesService();

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
  let history = get(historyStore);
  if (history.length === 0) return;
  const lastEvent = history.pop();
  if (lastEvent)
    undoEvent(lastEvent);
}

export function undoEvent(event: EditEvent) {
  const reverseEvent: EditEvent = createReverseEvent(event);
  applyEvent(reverseEvent);
  redoStore.update(redo => [...redo, event]);
  historyStore.update(history => history.filter(e => e !== event));
}

export function redoLastEvent() {
  const redo = get(redoStore);
  if (redo.length === 0) return;
  const event: EditEvent = redo.pop();
  if (event)
    redoEvent(event);
}

export function redoEvent(event: EditEvent) {
  applyEvent(event);
  historyStore.update(history => [...history, event]);
  redoStore.update(redo => redo.filter(e => e !== event));
}

export function createReverseEvent(event: EditEvent): EditEvent {
  console.log(event);
  switch (event.editType) {
    case EditType.INSERT:
      return {
        createdAt: event.createdAt,
        selector: event.selector,
        editType: EditType.REMOVE,
        newVal: event.oldVal,
        oldVal: event.newVal,
        path: event.path,
        componentId: event.componentId,
      } as EditEvent;
    case EditType.REMOVE:
      return {
        createdAt: event.createdAt,
        selector: event.selector,
        editType: EditType.INSERT,
        newVal: event.oldVal,
        oldVal: event.newVal,
        path: event.path,
        componentId: event.componentId,
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
        componentId: event.componentId,
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

function applyClassEvent(event: EditEvent, element: HTMLElement) {
  if (!element) return;
  Object.entries(event.newVal).forEach(([attr, newVal]) => {
    if (attr !== "full") return;
    applyChangeService.applyClass(element, newVal, false);
  });
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

function applyMoveEvent(event: EditEvent) {
  const oldVal = event.oldVal as MoveVal;
  const newVal = event.newVal as MoveVal;
  const parent = document.querySelector(oldVal.parentSelector);

  var container = Sortable.create(parent, {
    animation: 150,
    easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)'
  });

  // Move el to newIndex
  const order = container.toArray();
  order.splice(oldVal.index, 0, order.splice(newVal.index, 1)[0]);
  container.sort(order, true);
  container.destroy();
}

export function applyEvent(event: EditEvent, emit: boolean = true) {
  const element: HTMLElement | undefined = document.querySelector(event.selector);
  switch (event.editType) {
    case EditType.STYLE:
      applyStyleEvent(event, element);
      break;
    case EditType.TEXT:
      applyTextEvent(event, element);
      break;
    case EditType.CLASS:
      applyClassEvent(event, element);
      break;
    case EditType.INSERT:
      applyInsertEvent(event, element);
      break;
    case EditType.REMOVE:
      applyRemoveEvent(event, element);
      break;
    case EditType.MOVE:
      applyMoveEvent(event, element);
      break;
  }
  if (emit)
    messageService.publish(MessageType.EDIT_EVENT, event);
}

export function toggleEventVisibility(event: EditEvent, visible: boolean) {
  const element: HTMLElement | undefined = document.querySelector(event.selector);
  if (!element) return;
  if (visible) {
    const reverseEvent: EditEvent = createReverseEvent(event);
    applyEvent(reverseEvent, false);
  } else {
    applyEvent(event, false);
  }
}