import { get, writable, type Writable } from "svelte/store";
import { deepElementFromPoint, isOffBounds } from "../utilities";

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

  handleMouseOver = (e) => {
    const target = deepElementFromPoint(e.clientX, e.clientY);
    if (isOffBounds(target)) return;
    if (this.editing) return;

    e.preventDefault();
    e.stopPropagation();

    this.hoveredStore.set(target);
  }

  handleMouseOut = (e) => {
    this.hoveredStore.set(undefined);
  }

  handleClick = (e: MouseEvent) => {
    const target = deepElementFromPoint(e.clientX, e.clientY);
    if (isOffBounds(target)) return;

    e.preventDefault();
    e.stopPropagation();

    if (this.editing) return;

    if (!e.shiftKey) {
      this.selectedStore.set([target])
    } else {
      if (get(this.selectedStore).includes(target)) {
        this.unselect(target);
      } else {
        this.select(target);
      }
    }
  }

  handleDoubleClick = (e: MouseEvent) => {
    let target = deepElementFromPoint(e.clientX, e.clientY);

    // Find the most deeply nested element
    while (target.children.length > 0) {
      target = target.children[0];
    }

    if (isOffBounds(target)) return;

    e.preventDefault();
    e.stopPropagation();

    this.selectedStore.set([]);
    this.hoveredStore.set(undefined);
    this.editingStore.set(target);
  }

  select(item) {
    this.selectedStore.update((s) => [...s, item])
  }

  unselect(item) {
    this.selectedStore.update((s) => s.filter((i) => i !== item))
  }

  clear() {
    this.selectedStore.set([]);
  }
}