import { addToHistory } from "./history";
import { getUniqueSelector } from "../utilities";
import { EditType, type EditEvent, type InsertRemoveVal } from "$shared/models/editor";
import { emitEditEvent } from "../messages";

const elementSelectorCache: WeakMap<object, string> = new WeakMap(); // Cache for element selectors

function debounce(func, wait) {
  const timeouts = {};

  return function (...args) {
    const context = this;
    const editEvent = args[0] as HandleEditEventParams;
    const element = editEvent.el;

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

function undebounceHandleEditEvent(param: HandleEditEventParams) {
  const selector =
    elementSelectorCache.get(param.el) || getUniqueSelector(param.el);

  const event: EditEvent = {
    createdAt: new Date().toISOString(),
    selector: selector,
    editType: param.editType,
    newVal: param.newValue,
    oldVal: param.oldValue,
    path: param.el.dataset.onlookId,
    componentId: param.el.dataset.onlookComponentId
  };
  addToHistory(event);
  emitEditEvent(event);
}

let debouncedHandleEditEvent = debounce(undebounceHandleEditEvent, 1000);

export function handleEditEvent(param: HandleEditEventParams) {
  console.log('Handling edit event', param);
  if (param.editType === EditType.STYLE || param.editType === EditType.TEXT || param.editType === EditType.CLASS) {
    debouncedHandleEditEvent(param);
  } else {
    undebounceHandleEditEvent(param);
  }
}