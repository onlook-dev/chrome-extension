let historyStack = [];
let redoStack = [];
const UNDO_STYLE_CHANGE = "UNDO_STYLE_CHANGE";
const REDO_STYLE_CHANGE = "REDO_STYLE_CHANGE";

export function addToHistory(event) {
  // Merge to last item if styleType, selector and keys are the same
  // Keeping oldest old val and newest new val
  let lastEvent = peek();
  if (
    lastEvent &&
    lastEvent.detail.styleType === event.detail.styleType &&
    lastEvent.detail.selector === event.detail.selector
  ) {
    lastEvent.detail.newVal = event.detail.newVal;
  } else {
    historyStack.push(event);
  }
}

export function undoLastEvent() {
  const event = historyStack.pop();
  if (!event) return;

  const reverseEvent = {
    type: UNDO_STYLE_CHANGE,
    detail: {
      selector: event.detail.selector,
      styleType: event.detail.styleType,
      newVal: event.detail.oldVal,
      oldVal: event.detail.newVal,
      path: event.detail.path,
    },
  };

  window.postMessage(reverseEvent, window.location.origin);
  redoStack.push(event);
}

export function redoLastEvent() {
  const event = redoStack.pop();

  if (!event) return;
  event.type = REDO_STYLE_CHANGE;
  window.postMessage(event, window.location.origin);
  historyStack.push(event);
}

function peek() {
  return historyStack[historyStack.length - 1];
}