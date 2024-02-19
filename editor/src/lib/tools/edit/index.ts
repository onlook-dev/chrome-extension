import { editorPanelVisible } from '$lib/states/editor';
import { get } from 'svelte/store';
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
		this.selectorEngine.handleMouseOver(e);
		updateHoverRect((this.selectorEngine.hovered));
	}

	onMouseOut(e: MouseEvent): void {
		this.selectorEngine.handleMouseOut(e);
		removeHoverRect();
	}

	onClick(e: MouseEvent): void {

		this.selectorEngine.handleClick(e);
		editorPanelVisible.set(true);
		removeClickedRect();

		if (!this.selectorEngine.selected[0]) return;
		updateClickRect(this.selectorEngine.selected[0]);

		// ResizeObserver to watch size changes for element
		if (this.resizeObserver) this.resizeObserver.disconnect();
		this.resizeObserver = new ResizeObserver(entries => {
			for (let entry of entries) {
				updateClickRect(entry.target as HTMLElement);
			}
		});
		this.resizeObserver.observe(this.selectorEngine.selected[0]);
	}

	onScreenResize(e: MouseEvent): void {
		if (this.selectorEngine.selected[0]) {
			updateClickRect(this.selectorEngine.selected[0]);
		}
	}
}
