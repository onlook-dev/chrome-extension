import { EditType } from "$shared/models/editor";
import { handleEditEvent } from "./handleEvents";

export interface ClassValues {
  oldVal: string;
  newVal: string;
}

export class ApplyChangesService {
  classCache: WeakMap<HTMLElement, ClassValues> = new WeakMap();

  constructor() { }

  getClassValue(el: HTMLElement): ClassValues {
    return this.classCache.get(el) || { oldVal: "", newVal: "" };
  }

  applyClass(el: HTMLElement, newClass: string) {
    let stored = this.classCache.get(el);
    if (!stored) {
      // Save the original class if not previously saved
      stored = { oldVal: el.className, newVal: newClass } as ClassValues;
      this.classCache.set(el, stored);
    } else {
      // Update the edit class
      stored.newVal = newClass;
    }
    // Apply original + new classes
    el.className = `${stored.oldVal} ${stored.newVal}`;
    handleEditEvent({
      el,
      editType: EditType.ATTR,
      newValue: { class: stored.newVal },
      oldValue: { class: "" },
    });
  }

  applyStyle(el: HTMLElement, key: string, value: string) {
    // Initialize the oldStyles map if it doesn't exist
    let oldStyles = el.dataset.oldStyles
      ? JSON.parse(el.dataset.oldStyles)
      : {};

    // Save the current style value to the map before updating, only if it doesn't exist
    if (oldStyles[key] === undefined) {
      const oldStyle = el.style[key];
      if (oldStyle !== undefined) {
        // Save only if there's a current value
        oldStyles[key] = oldStyle;
        el.dataset.oldStyles = JSON.stringify(oldStyles); // Serialize and save back to dataset
      }
    }

    // Update the style
    el.style[key] = value;
    // Emit event
    handleEditEvent({
      el,
      editType: EditType.STYLE,
      newValue: { [key]: value },
      oldValue: { [key]: oldStyles[key] },
    });
  }
}