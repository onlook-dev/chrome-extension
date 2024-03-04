import { addToHistory } from "./history";
import { getUniqueSelector } from "../utilities";
import type { EditEvent, EditType } from "$lib/types/editor";

const OPEN_PROJECT: string = "OPEN_PROJECT";
const elementSelectorCache: WeakMap<object, string> = new WeakMap(); // Cache for element selectors

function debounce(func, wait) {
  const timeouts = {};

  return function (...args) {
    const context = this;
    const element = args[0];

    // Use cached selector if available, otherwise compute and cache it
    if (!elementSelectorCache.has(element)) {
      elementSelectorCache.set(
        element,
        getUniqueSelector(element)
      );
    }
    const elementSelector = elementSelectorCache.get(element);

    if (timeouts[elementSelector]) clearTimeout(timeouts[elementSelector]);

    const later = () => {
      delete timeouts[elementSelector];
      func.apply(context, args);
    };

    clearTimeout(timeouts[elementSelector]);
    timeouts[elementSelector] = setTimeout(later, wait);
  };
}

function postMessage(el: HTMLElement, editType: EditType, newValue: Record<string, string>, oldValue: Record<string, string>) {
  const selector =
    elementSelectorCache.get(el) || getUniqueSelector(el);

  const event: EditEvent = {
    createdAt: new Date().toISOString(),
    selector: selector,
    editType: editType,
    newVal: newValue,
    oldVal: oldValue,
    path: el.dataset.onlookId,
  };
  addToHistory(event as EditEvent);
  window.postMessage(event, window.location.origin);
}

let debouncedPostMessage = debounce(postMessage, 1000);

export function emitStyleChangeEvent(el: HTMLElement, styleType: string, newValue: Record<string, string>, oldValue: Record<string, string>) {
  debouncedPostMessage(el, styleType, newValue, oldValue);
}

export function emitOpenProjectMessage() {
  window.postMessage({ type: OPEN_PROJECT }, window.location.origin);
};