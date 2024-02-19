import { deepElementFromPoint, isOffBounds } from "../utilities";

export class SelectorEngine {
  page = document.body
  selected: HTMLElement[] = []
  hovered: HTMLElement | undefined = undefined

  constructor() {
    this.selected = [];
  }

  handleMouseOver = (e) => {
    const target = deepElementFromPoint(e.clientX, e.clientY);
    if (isOffBounds(target)) return;
    this.hovered = target;
  }

  handleMouseOut = (e) => {
    this.hovered = null;
  }

  handleClick = (e: MouseEvent) => {
    const target = deepElementFromPoint(e.clientX, e.clientY);
    if (isOffBounds(target)) return;

    e.preventDefault();
    e.stopPropagation();

    if (!e.shiftKey) {
      this.selected = [target];
    } else {
      if (this.selected.includes(target)) {
        this.unselect(target);
      } else {
        this.select(target);
      }
    }
  }

  select(item) {
    this.selected.push(item);
  }

  unselect(item) {
    this.selected = this.selected.filter((i) => i !== item);
  }

  clear() {
    this.selected = [];
  }
}