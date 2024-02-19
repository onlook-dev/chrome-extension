import { editorPanelVisible } from '$lib/states/editor';
import type { Tool } from '../index';
import { OverlayManager } from '../selection/overlay';

import { SelectorEngine } from '../selection/selector';
import { findCommonParent } from '../utilities';

export class EditTool implements Tool {
	resizeObserver: ResizeObserver;
	selectorEngine: SelectorEngine;
	overlayManager: OverlayManager;

	constructor() {
		this.selectorEngine = new SelectorEngine();
		this.overlayManager = new OverlayManager();
	}

	onInit() { }

	onDestroy() {
		editorPanelVisible.set(false);
		this.overlayManager.clear();
		this.selectorEngine.clear();
	}

	onMouseOver(e: MouseEvent): void {
		this.selectorEngine.handleMouseOver(e);
		this.overlayManager.updateHoverRect((this.selectorEngine.hovered));
	}

	onMouseOut(e: MouseEvent): void {
		this.selectorEngine.handleMouseOut(e);
		this.overlayManager.removeHoverRect();
	}

	onClick(e: MouseEvent): void {
		editorPanelVisible.set(true);
		this.selectorEngine.handleClick(e);
		this.overlayManager.removeHoverRect();
		this.overlayManager.removeClickedRects();

		this.selectorEngine.selected.forEach((el) => {
			this.overlayManager.addClickRect(el);
		});

		if (this.selectorEngine.selected.length > 0) {
			const parent = findCommonParent(...this.selectorEngine.selected);
			this.overlayManager.updateParentRect(parent);

		} else {
			this.overlayManager.removeParentRect();
		}
	}

	onScreenResize(e: MouseEvent): void {
		this.overlayManager.removeClickedRects();
		this.selectorEngine.selected.forEach((el) => {
			this.overlayManager.addClickRect(el);
		})
	}
}
