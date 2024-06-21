import { MessageService, MessageType } from '$shared/message';
import { EditType, type ChildVal, type EditEvent, type TextVal } from '$shared/models';
import { get, writable } from 'svelte/store';
import { ApplyChangesService } from './applyChange';

import { dragContainers } from '$lib/states/editor';
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
      // TODO: Revisit this with other structural changes
      (lastEvent.editType === EditType.STYLE ||
        lastEvent.editType === EditType.CLASS ||
        lastEvent.editType === EditType.TEXT) &&
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
  const reverseEvent: EditEvent = {
    ...event,
    newVal: event.oldVal,
    oldVal: event.newVal,
  };
  switch (event.editType) {
    case EditType.INSERT_CHILD:
      return {
        ...reverseEvent,
        editType: EditType.REMOVE_CHILD,

      } as EditEvent;
    case EditType.REMOVE_CHILD:
      return {
        ...reverseEvent,
        editType: EditType.INSERT_CHILD,
      } as EditEvent;
    default:
      return reverseEvent;
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

function applyInsertEvent(event: EditEvent, element: HTMLElement) {
  const newVal = event.newVal as ChildVal;
  const parser = new DOMParser();
  const doc = parser.parseFromString(newVal.content, "application/xml");
  const child = doc.documentElement

  if (!child || !element) return;
  const pos = parseInt(newVal.index);

  // If child exists inside parent using childSelector, replace it
  if (newVal.selector) {
    const oldChild = element.querySelector(newVal.selector) as HTMLElement;
    if (oldChild) {
      element.replaceChild(child, oldChild);
      return;
    }
  }

  if (pos < element.children.length) {
    element.insertBefore(child, element.children[pos]);
  } else {
    element.appendChild(child);
  }
}

function applyRemoveEvent(event: EditEvent, element: HTMLElement) {
  if (!element) return;
  const newVal = event.newVal as ChildVal;
  const child = document.querySelector(newVal.selector) as HTMLElement;
  if (!child) return;
  element.removeChild(child);
}

function applyMoveEvent(event: EditEvent, element: HTMLElement) {
  const oldVal = event.oldVal as ChildVal;
  const newVal = event.newVal as ChildVal;

  let container = dragContainers.get(element) ?? Sortable.create(element, {
    animation: 150,
    easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)'
  });
  const order = container.toArray();

  // Remove the element from the old position
  const [movedElement] = order.splice(oldVal.index, 1);

  // Insert the element to the new position
  order.splice(newVal.index, 0, movedElement);
  container.sort(order, true);

  // Clean up if container created
  if (!dragContainers.has(element)) {
    container.destroy();
  }
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
    case EditType.INSERT_CHILD:
      applyInsertEvent(event, element);
      break;
    case EditType.REMOVE_CHILD:
      applyRemoveEvent(event, element);
      break;
    case EditType.MOVE_CHILD:
      applyMoveEvent(event, element);
      break;
  }
  if (emit)
    messageService.publish(MessageType.EDIT_EVENT, event);
}

export function toggleEventVisibility(event: EditEvent, visible: boolean) {
  if (visible) {
    const reverseEvent: EditEvent = createReverseEvent(event);
    applyEvent(reverseEvent, false);
  } else {
    applyEvent(event, false);
  }
}