import { get, writable, type Writable } from "svelte/store";
import { deepElementFromPoint, isOffBounds } from "../utilities";

export class SelectorEngine {
  page = document.body
  selectedStore: Writable<HTMLElement[]> = writable([]);
  hoveredStore: Writable<HTMLElement | undefined> = writable(undefined);
  observer: MutationObserver;

  constructor() { }

  get selected() {
    return get(this.selectedStore);
  }

  get hovered() {
    return get(this.hoveredStore);
  }

  handleMouseOver = (e) => {
    const target = deepElementFromPoint(e.clientX, e.clientY);
    if (isOffBounds(target)) return;
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