import { EditType } from "$shared/models/editor";
import { getUniqueSelector } from "../utilities";
import { handleEditEvent } from "./handleEvents";
import { tw } from 'twind'

export class ApplyChangesService {
  appendedClassCache = new Map<string, string>();
  constructor() { }

  getUpdatedClasses(el: HTMLElement): string {
    return el.className;
  }

  applyClass(el: HTMLElement, value: string, emit = true) {
    const oldVals = this.getAndSetOldVal(el, 'attr', 'className');

    // Get only the changed classes
    const changedClasses = value.split(' ').filter((c) => !oldVals.attr.className.includes(c)).join(' ').trim();

    // Apply original + new classes
    el.className = `${oldVals.attr.className} ${tw`${changedClasses}`}`

    // Update cache
    const selector = getUniqueSelector(el);
    this.appendedClassCache.set(selector, value);

    if (!emit) return;
    handleEditEvent({
      el,
      editType: EditType.CLASS,
      newValue: { updated: changedClasses, full: value },
      oldValue: { updated: '', full: oldVals.attr.className },
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