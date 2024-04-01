import { EditType } from "$shared/models/editor";
import { getUniqueSelector } from "../utilities";
import { handleEditEvent } from "./handleEvents";
import { tw } from 'twind'

export class ApplyChangesService {
  appendedClassCache = new Map<string, string>();
  constructor() { }

  getAppendedClasses(el: HTMLElement): string {
    const selector = getUniqueSelector(el);
    const appendedClass = this.appendedClassCache.get(selector) || '';
    return appendedClass
  }

  applyClass(el: HTMLElement, value: string, emit = true) {
    const oldVals = this.getAndSetOldVal(el, 'attr', 'className');

    // Apply original + new classes
    el.className = `${oldVals.attr.className} ${tw`${value}`}`

    // Update cache
    const selector = getUniqueSelector(el);
    this.appendedClassCache.set(selector, value);

    if (!emit) return;
    handleEditEvent({
      el,
      editType: EditType.ATTR,
      newValue: { className: value },
      oldValue: { className: '' }
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

  getOldVals(el: HTMLElement): Record<string, Record<string, string>> {
    return el.dataset.oldVals ? JSON.parse(el.dataset.oldVals) : {};
  }

  setOldVals(el: HTMLElement, oldVals: Record<string, Record<string, string>>) {
    el.dataset.oldVals = JSON.stringify(oldVals);
  }

  getAndSetOldVal(el: HTMLElement, type: string, key: string): Record<string, Record<string, string>> {
    const oldVals = this.getOldVals(el);

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
        this.setOldVals(el, oldVals);
      }
    }

    return oldVals;
  }
}