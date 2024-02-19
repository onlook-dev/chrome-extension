import { editorPanelVisible } from '$lib/states/editor';
import type { Tool } from '../index';
import {
	updateClickRect,
	updateHoverRect,
	removeClickedRect,
	removeHoverRect
} from '../selection/rect';
import { SelectorEngine } from '../selection/selector';

export class EditTool implements Tool {
	resizeObserver: ResizeObserver;
	selectorEngine: SelectorEngine;

	constructor() {
		this.selectorEngine = new SelectorEngine();
	}

	onInit() { }

	onDestroy() {
		editorPanelVisible.set(false);
		removeClickedRect();
		removeHoverRect();
		this.selectorEngine.clear();
	}

	onMouseOver(e: MouseEvent): void {
		// this.hoveredElement = el;
		// updateHoverRect(el);
	}

	onMouseOut(e: MouseEvent): void {
		// this.hoveredElement = null;
		// removeHoverRect();
	}

	onClick(el: MouseEvent): void {
		// this.clickedElement = el;
		// editorPanelVisible.set(true);
		// removeClickedRect();
		// updateClickRect(el);

		// // ResizeObserver to watch size changes for element
		// if (this.resizeObserver) this.resizeObserver.disconnect();
		// this.resizeObserver = new ResizeObserver(entries => {
		// 	for (let entry of entries) {
		// 		updateClickRect(entry.target);
		// 	}
		// });
		// this.resizeObserver.observe(el);
	}

	onScreenResize(e: MouseEvent): void {
		// if (this.clickedElement) {
		// 	updateClickRect(this.clickedElement);
		// }
	}
}
