import { EditType } from "$shared/models/editor";
import { handleEditEvent } from "./handleEvents";

export class ApplyChangesService {
  constructor() { }

  getOriginalClass(el: HTMLElement): string {
    const oldVals = this.getOldVals(el);
    return oldVals.class?.original || el.className;
  }

  getAppendedClass(el: HTMLElement): string {
    const oldVals = this.getOldVals(el);
    return oldVals.class?.appended || "";
  }

  applyClass(el: HTMLElement, newClass: string, emit = true) {
    const oldVals = this.getOldVals(el);
    if (!oldVals.class) {
      // Save the original class if not previously saved
      oldVals.class = { original: el.className, appended: newClass };
      this.setOldVals(el, oldVals);
    } else {
      // Update the appended class
      oldVals.class.appended = newClass;
      this.setOldVals(el, oldVals);
    }
    // Apply original + new classes
    el.className = `${oldVals.class.original} ${oldVals.class.appended}`;
    if (!emit) return;
    handleEditEvent({
      el,
      editType: EditType.ATTR,
      newValue: { class: oldVals.class.appended },
      oldValue: { class: oldVals.class.original },
    });
  }

  applyStyle(el: HTMLElement, key: string, value: string, emit = true) {
    const oldVals = this.getOldVals(el);
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

  getOldVals(el: HTMLElement): any {
    return el.dataset.oldVals ? JSON.parse(el.dataset.oldVals) : {};
  }

  setOldVals(el: HTMLElement, oldVals: any): void {
    el.dataset.oldVals = JSON.stringify(oldVals);
  }

  saveOldVals(el: HTMLElement, key: string): Record<string, string> {
    let oldVals = this.getOldVals(el);

    // Save the current style value to the map before updating, only if it doesn't exist
    if (oldVals.style === undefined) {
      oldVals.style = {};
    }
    if (oldVals.style[key] === undefined) {
      const oldStyle = el.style[key];
      if (oldStyle !== undefined) {
        // Save only if there's a current value
        oldVals.style[key] = oldStyle;
        this.setOldVals(el, oldVals); // Serialize and save back to dataset
      }
    }

    return oldVals.style;
  }
}