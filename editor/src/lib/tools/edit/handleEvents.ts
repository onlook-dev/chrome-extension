import { addToHistory } from "./history";
import { getDataOnlookComponentId, getDataOnlookId, getSnapshot, getUniqueSelector } from "../utilities";
import { EditType, type EditEvent, type StructureVal } from "$shared/models";
import { MessageService, MessageType } from "$shared/message";
import { DATA_ONLOOK_SNAPSHOT } from "$shared/constants";

const elementSelectorCache: WeakMap<object, string> = new WeakMap(); // Cache for element selectors
const messageService = MessageService.getInstance();

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
  newValue: EditEvent["newVal"],
  oldValue: EditEvent["oldVal"],
}

function undebounceHandleEditEvent(param: HandleEditEventParams) {
  const el = param.el;
  const selector =
    elementSelectorCache.get(el) || getUniqueSelector(el);
  const snapshot = el.getAttribute(DATA_ONLOOK_SNAPSHOT);
  const componentId = getDataOnlookComponentId(el);
  const path = getDataOnlookId(el);
  let event: EditEvent = {
    createdAt: new Date().toISOString(),
    selector,
    editType: param.editType,
    newVal: param.newValue,
    oldVal: param.oldValue,
    path,
    snapshot,
    componentId
  };
  addToHistory(event);

  // If event is applied to an inserted component, send an updated insert event for the parent element instead
  // This way, it is saved in the activity as an insert only once, the content will be used to update the inserted component
  if (componentId) {
    const parent = el.parentElement;
    const parentSelector =
      elementSelectorCache.get(parent) || getUniqueSelector(parent);
    const content = (new XMLSerializer).serializeToString(el);

    // This is the insert event for child
    const structureVal: StructureVal = {
      childSelector: selector,
      childPath: getDataOnlookId(el),
      index: Array.from(parent.children).indexOf(el).toString(),
      componentId: getDataOnlookComponentId(parent),
      content: content
    };

    // This is the insert event for parent
    event = {
      createdAt: new Date().toISOString(),
      selector: parentSelector,
      editType: EditType.INSERT_CHILD,
      newVal: structureVal,
      oldVal: { ...structureVal, content: '' },
      path: getDataOnlookId(parent),
      snapshot: getSnapshot(parent),
      componentId: getDataOnlookComponentId(parent)
    };
  }

  messageService.publish(MessageType.EDIT_EVENT, event);
}

let debouncedHandleEditEvent = debounce(undebounceHandleEditEvent, 1000);

export function handleEditEvent(param: HandleEditEventParams) {
  if (param.editType === EditType.STYLE || param.editType === EditType.TEXT || param.editType === EditType.CLASS) {
    debouncedHandleEditEvent(param);
  } else {
    undebounceHandleEditEvent(param);
  }
}