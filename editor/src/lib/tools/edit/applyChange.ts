import { EditType } from "$shared/models/editor";
import { handleEditEvent } from "./handleEvents";

export interface ClassValues {
  oldVal: string;
  newVal: string;
}

export class ApplyChangesService {
  elementToClass: WeakMap<HTMLElement, { oldVal: string; newVal: string }> = new WeakMap();

  constructor() { }

  getClassValue(el: HTMLElement): ClassValues {
    return this.elementToClass.get(el) || { oldVal: "", newVal: "" };
  }

  applyClass(el: HTMLElement, newClass: string) {
    let stored = this.elementToClass.get(el);
    if (!stored) {
      // Save the original class if not previously saved
      stored = { oldVal: el.className, newVal: newClass } as ClassValues;
      this.elementToClass.set(el, stored);
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
}