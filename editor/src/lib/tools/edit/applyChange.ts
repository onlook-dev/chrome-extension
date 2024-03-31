import { EditType } from "$shared/models/editor";
import { handleEditEvent } from "./handleEvents";
import { tw } from 'twind'

export class ApplyChangesService {
  constructor() { }

  applyClass(el: HTMLElement, value: string, emit = true) {
    const oldVals = this.getAndSetOldVal(el, 'attr', 'className');

    // Apply original + new classes
    el.className = tw`${value}`
    if (!emit) return;
    handleEditEvent({
      el,
      editType: EditType.ATTR,
      newValue: { className: value },
      oldValue: { className: oldVals.attr.className }
    });
  }

  applyStyle(el: HTMLElement, key: string, value: string, emit = true) {
    const oldVals = this.getAndSetOldVal(el, 'style', key);
    // Update the style
    el.style[key] = value;

    if (!emit) return;

    // Emit event
    handleEditEvent({
      el,
      editType: EditType.STYLE,
      newValue: { [key]: value },
      oldValue: { [key]: oldVals.style[key] },
    });
  }

  getAndSetOldVal(el: HTMLElement, type: string, key: string): Record<string, Record<string, string>> {
    let oldVals: Record<string, Record<string, string>> = el.dataset.oldVals ? JSON.parse(el.dataset.oldVals) : {};

    // Save the current style value to the map before updating, only if it doesn't exist
    if (oldVals[type] === undefined) {
      oldVals[type] = {};
    }

    if (oldVals[type][key] === undefined) {
      let oldVal = ''
      if (type === 'style') {
        oldVal = el[type][key];
      } else if (type === 'attr') {
        if (key === 'className') {
          oldVal = el.getAttribute('class') || '';
        } else {
          oldVal = el.getAttribute(key) || '';
        }
      }

      if (oldVal !== undefined) {
        // Save only if there's a current value
        oldVals[type][key] = oldVal;
        el.dataset.oldVals = JSON.stringify(oldVals);
      }
    }

    return oldVals;
  }
}