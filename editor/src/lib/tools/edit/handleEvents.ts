import { addToHistory } from "./history";
import { getUniqueSelector } from "../utilities";
import type { EditEvent, EditType, InsertRemoveVal } from "$lib/types/editor";
import { emitEditEvent } from "../messages";

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

interface HandleEditEventParams {
  el: HTMLElement,
  editType: EditType,
  newValue: Record<string, string> | InsertRemoveVal,
  oldValue: Record<string, string> | InsertRemoveVal
}

function handleEditEvent(param: HandleEditEventParams) {
  const selector =
    elementSelectorCache.get(param.el) || getUniqueSelector(param.el);

  const event: EditEvent = {
    createdAt: new Date().toISOString(),
    selector: selector,
    editType: param.editType,
    newVal: param.newValue,
    oldVal: param.oldValue,
    path: param.el.dataset.onlookId,
  };

  addToHistory(event as EditEvent);
  emitEditEvent(event);
}

let debouncedHandleEditEvent = debounce(handleEditEvent, 1000);

export function handleStyleChangeEvent(param: HandleEditEventParams) {
  debouncedHandleEditEvent(param);
}