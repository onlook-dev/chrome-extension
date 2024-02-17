import { finder } from "@medv/finder";
import { addToHistory } from "./history";

const STYLE_CHANGE: string = "STYLE_CHANGE";
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
        finder(element, { className: () => false })
      );
    }
    const elementSelector = elementSelectorCache.get(element);

    if (!timeouts[elementSelector]) {
      func.apply(context, args); // Execute immediately
    } else {
      clearTimeout(timeouts[elementSelector]);
    }

    const later = () => {
      delete timeouts[elementSelector];
      func.apply(context, args);
    };

    clearTimeout(timeouts[elementSelector]);
    timeouts[elementSelector] = setTimeout(later, wait);
  };
}

function postMessage(el: HTMLElement, styleType: string, newValue: Record<string, string>, oldValue: Record<string, string>) {
  const selector =
    elementSelectorCache.get(el) || finder(el, { className: () => false });

  const event = {
    type: STYLE_CHANGE,
    detail: {
      selector: selector,
      styleType: styleType,
      newVal: newValue,
      oldVal: oldValue,
      path: el.dataset.onlookId,
    },
  };

  addToHistory(event);
  window.postMessage(event, window.location.origin);
}

let debouncedPostMessage = debounce(postMessage, 1000);

export function emitStyleChangeEvent(el: HTMLElement, styleType: string, newValue: Record<string, string>, oldValue: Record<string, string>) {
  debouncedPostMessage(el, styleType, newValue, oldValue);
}