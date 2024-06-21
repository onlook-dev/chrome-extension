import { get, writable, type Writable } from "svelte/store";
import { deepElementFromPoint, getByDataOnlookId, getDataOnlookId, isOffBounds, rehoistPopovers } from "../utilities";

export class SelectorEngine {
  page = document.body
  selectedStore: Writable<HTMLElement[]> = writable([]);
  hoveredStore: Writable<HTMLElement | undefined> = writable(undefined);
  editingStore: Writable<HTMLElement | undefined> = writable(undefined);
  observer: MutationObserver;

  constructor() { }

  get selected() {
    return get(this.selectedStore);
  }

  get hovered() {
    return get(this.hoveredStore);
  }

  get editing() {
    return get(this.editingStore);
  }

  handleMouseOver = (e: MouseEvent) => {
    const target = deepElementFromPoint(e.clientX, e.clientY);
    if (isOffBounds(target)) return;
    if (this.editing) return;

    if (!e.metaKey) {
      e.preventDefault();
      e.stopPropagation();
    }

    this.hoveredStore.set(target);
  }

  handleMouseOut = (e) => {
    this.hoveredStore.set(undefined);
  }

  handleClick = (e: MouseEvent) => {
    const target = deepElementFromPoint(e.clientX, e.clientY);
    if (isOffBounds(target) || this.editing) return;

    if (!e.shiftKey) {
      this.select(target, true);
    } else {
      document.getSelection().removeAllRanges();
      if (get(this.selectedStore).includes(target)) {
        this.unselect(target);
      } else {
        this.select(target);
      }
    }

    if (!e.metaKey) {
      e.preventDefault();
      e.stopPropagation();
      this.blurInputs();
    }
  }

  handleDoubleClick = (e: MouseEvent) => {
    let target = deepElementFromPoint(e.clientX, e.clientY);

    // Find the most deeply nested element
    while (target.children.length > 0) {
      target = target.children[0] as HTMLElement;
    }

    if (target === this.editing || isOffBounds(target)) return;

    e.preventDefault();
    e.stopPropagation();

    this.selectedStore.set([target]);
    this.hoveredStore.set(undefined);
    this.editingStore.set(target);
  }

  select(item, clear = false) {
    const targets = [item]
    const dataOnlookId = getDataOnlookId(item);
    // Select similar detected components
    dataOnlookId && targets.push(...getByDataOnlookId(dataOnlookId));

    if (clear) {
      this.selectedStore.update((s) => [...targets])
    } else {
      this.selectedStore.update((s) => [...s, ...targets])
    }
    rehoistPopovers();
  }

  blurInputs() {
    // Inputs should be blurred so hotkeys work on them
    this.selected.forEach((el) => {
      if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
        el.blur();
      }
    });
  }

  unselect(item) {
    const targets = [item]
    const dataOnlookId = getDataOnlookId(item);
    dataOnlookId && targets.push(...getByDataOnlookId(dataOnlookId));

    this.selectedStore.update((s) => s.filter((i) => targets.includes(i) === false))
  }

  clear() {
    this.selectedStore.set([]);
  }
}