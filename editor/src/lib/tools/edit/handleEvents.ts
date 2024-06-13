import { addToHistory } from "./history";
import { getDataOnlookComponentId, getDataOnlookId, getSnapshot, getUniqueSelector } from "../utilities";
import { EditType, type EditEvent, type StructureVal } from "$shared/models";
import { MessageService, MessageType } from "$shared/message";
import { EditSource } from "$shared/models/editor";

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
  source?: EditSource
}

export function undebounceHandleEditEvent(param: HandleEditEventParams) {
  const el = param.el;
  const componentId = getDataOnlookComponentId(el);
  let event: EditEvent = {
    createdAt: new Date().toISOString(),
    selector: elementSelectorCache.get(el) || getUniqueSelector(el),
    editType: param.editType,
    newVal: param.newValue,
    oldVal: param.oldValue,
    path: getDataOnlookId(el),
    snapshot: getSnapshot(el),
    componentId,
    source: param.source || EditSource.MANUAL
  };
  addToHistory(event);

  // If event is applied to an inserted component, send an updated insert event for the nearest ancestor that does not have data-onlook-component-id
  // This way, it is saved in the activity as an insert only once, the content will be used to update the inserted component
  if (componentId) {
    let child = el;
    let parent = el.parentElement;
    while (parent && getDataOnlookComponentId(parent)) {
      child = parent;
      parent = parent.parentElement;
    }
    if (!parent) return;

    const parentSelector = elementSelectorCache.get(parent) || getUniqueSelector(parent);
    const content = (new XMLSerializer).serializeToString(child);

    // This is the insert event for child
    const structureVal: StructureVal = {
      childSelector: getUniqueSelector(child),
      childPath: getDataOnlookId(child),
      index: Array.from(parent.children).indexOf(child).toString(),
      componentId: getDataOnlookComponentId(parent),
      content
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