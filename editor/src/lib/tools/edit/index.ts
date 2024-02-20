import { editorPanelVisible } from '$lib/states/editor';
import type { Tool } from '../index';
import { OverlayManager } from '../selection/overlay';
import { SelectorEngine } from '../selection/selector';
import { findCommonParent } from '../utilities';

export class EditTool implements Tool {
	selectorEngine: SelectorEngine;
	overlayManager: OverlayManager;
	elResizeObserver: ResizeObserver;

	constructor() {
		this.selectorEngine = new SelectorEngine();
		this.overlayManager = new OverlayManager();
		// Initialize ResizeObserver with a callback
		this.elResizeObserver = new ResizeObserver(entries => {
			const observedElements = entries.map(entry => entry.target);
			this.onElementResize(observedElements);
		});
	}

	onInit() {

	}

	onDestroy() {
		editorPanelVisible.set(false);
		this.overlayManager.clear();
		this.selectorEngine.clear();
		this.elResizeObserver.disconnect();
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

		this.elResizeObserver.disconnect();

		this.selectorEngine.selected.forEach((el) => {
			this.overlayManager.addClickRect(el);
			this.elResizeObserver.observe(el);
		});
	}

	onScreenResize(e: Event): void {
		this.updateClickedRects(this.selectorEngine.selected);
	}

	onElementResize(els: Element[]): void {
		this.updateClickedRects(els);
	}

	updateClickedRects(els: Element[]) {
		this.overlayManager.removeClickedRects();
		els.forEach((el) => {
			this.overlayManager.addClickRect(el as HTMLElement);
		})
		this.updateParentRect();
	}

	updateParentRect() {
		if (this.selectorEngine.selected.length > 0) {
			const parent = findCommonParent(...this.selectorEngine.selected);
			this.overlayManager.updateParentRect(parent);
		} else {
			this.overlayManager.removeParentRect();
		}
	}

	simulateClick(selector: string) {
		const el = document.querySelector(selector);
		if (el) {
			this.selectorEngine.selectedStore.set([el as HTMLElement]);
			this.overlayManager.removeClickedRects();
			this.overlayManager.addClickRect(el as HTMLElement);
		}
	}

	simulateHover = (selector: string) => {
		const el = document.querySelector(selector);
		if (el) {
			this.selectorEngine.hoveredStore.set(el as HTMLElement);
			this.overlayManager.updateHoverRect(el as HTMLElement);
		}
	}

	simulateOut = () => {
		const el = this.selectorEngine.hovered;
		if (el) {
			this.selectorEngine.hoveredStore.set(undefined);
			this.overlayManager.removeHoverRect();
		}
	}
}
