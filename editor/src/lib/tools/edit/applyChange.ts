import { EditType } from "$shared/models";
import { getUniqueSelector } from "../utilities";
import { handleEditEvent } from "./handleEvents";
import { tw } from 'twind'

export class ApplyChangesService {
  appendedClassCache = new Map<string, string>();
  constructor() { }

  getUpdatedClasses(el: HTMLElement): string {
    try {
      if (!el || !el.className || !el.className.replace) return '';
      return el.className.replace(/override:/g, '').trim();
    } catch (e) {
      console.error('Error getting updated classes', e);
      return '';
    }
  }

  applyClass(el: HTMLElement, value: string, emit = true) {
    const oldVals = this.getAndSetOldVal(el, 'attr', 'className');
    const oldClasses = oldVals.attr.className.split(' ');

    // Process the inputs into new and old. Override with new when possible.
    const newClasses = value.split(' ');
    const removedClasses = oldClasses.filter(c => !newClasses.includes(c));
    const updatedClasses = newClasses.filter(c => !oldClasses.includes(c));
    const originalClasses = oldClasses.filter(c => !updatedClasses.includes(c) && !removedClasses.includes(c));

    // Set the tailwind classes
    el.className = tw`${originalClasses} override:(${updatedClasses})`;

    // Update cache
    const selector = getUniqueSelector(el);
    this.appendedClassCache.set(selector, value);

    // Emit event if necessary
    if (emit) {
      handleEditEvent({
        el,
        editType: EditType.CLASS,
        newValue: { updated: updatedClasses.join(' '), removed: removedClasses.join(' '), full: value },
        oldValue: { updated: removedClasses.join(' '), removed: updatedClasses.join(' '), full: oldVals.attr.className },
      });
    }
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