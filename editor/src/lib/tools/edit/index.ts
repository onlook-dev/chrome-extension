import { ONLOOK_EDITABLE } from '$lib/constants';
import { editorPanelVisible } from '$lib/states/editor';
import { EditType, type InsertRemoveVal } from '$lib/types/editor';
import type { Tool } from '../index';
import { OverlayManager } from '../selection/overlay';
import { SelectorEngine } from '../selection/selector';
import { findCommonParent, getUniqueSelector } from '../utilities';
import { handleEditEvent } from './handleEvents';

export class EditTool implements Tool {
	selectorEngine: SelectorEngine;
	overlayManager: OverlayManager;
	elResizeObserver: ResizeObserver;
	oldText: string | undefined;
	copiedElement: HTMLElement | undefined;

	constructor() {
		this.selectorEngine = new SelectorEngine();
		this.overlayManager = new OverlayManager();

		// Initialize resize observer for click element resize
		this.elResizeObserver = new ResizeObserver(entries => {
			const observedElements = entries.map(entry => entry.target);
			this.onElementResize(observedElements);
		});
	}

	onInit() { }

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
		this.overlayManager.clear();
		this.elResizeObserver.disconnect();

		this.selectorEngine.selected.forEach((el) => {
			this.overlayManager.addClickRect(el);
			this.elResizeObserver.observe(el);
		});
	}

	onDoubleClick(e: MouseEvent): void {
		if (this.selectorEngine.editing) this.removeEditability({ target: this.selectorEngine.editing });
		editorPanelVisible.set(true);
		this.overlayManager.clear()
		this.elResizeObserver.disconnect();
		this.selectorEngine.handleDoubleClick(e);
		this.addEditability(this.selectorEngine.editing);
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

	simulateClick(els: HTMLElement[]) {
		if (!els) return;

		this.selectorEngine.selectedStore.set(els);
		this.overlayManager.clear();
		this.elResizeObserver.disconnect();
		this.selectorEngine.selected.forEach((el) => {
			this.overlayManager.addClickRect(el);
			this.elResizeObserver.observe(el);
		});
		if (els.length > 0)
			this.scrollElementIntoView(els[0]);
	}

	simulateHover = (el: HTMLElement) => {
		if (!el) return
		this.selectorEngine.hoveredStore.set(el as HTMLElement);
		this.overlayManager.updateHoverRect(el as HTMLElement);
	}

	simulateOut = () => {
		const el = this.selectorEngine.hovered;
		if (!el) return
		this.selectorEngine.hoveredStore.set(undefined);
		this.overlayManager.removeHoverRect();
	}

	scrollElementIntoView(el: HTMLElement) {
		if (!el) return;
		const rect = el.getBoundingClientRect();
		const isVisible = (
			rect.top >= 0 &&
			rect.left >= 0 &&
			rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
			rect.right <= (window.innerWidth || document.documentElement.clientWidth)
		);

		if (!isVisible) {
			// Calculate the position to scroll to with 1/3vh padding
			const viewportPadding = window.innerHeight / 3;
			const topPositionToScroll = rect.top + window.scrollY - viewportPadding;

			window.scrollTo({
				top: topPositionToScroll,
				behavior: "smooth"
			});
		}
	}

	addEditability = (el: HTMLElement) => {
		if (!el) return;
		this.oldText = el.textContent;
		el.setAttribute("contenteditable", "true");
		el.setAttribute("spellcheck", "true");
		el.classList.add(ONLOOK_EDITABLE);
		el.focus();

		el.addEventListener("keydown", this.stopBubbling);
		el.addEventListener("blur", this.removeEditability);
		el.addEventListener("input", this.handleInput);
	}

	handleInput = ({ target }) => {
		const newText = target.textContent
		handleEditEvent({
			el: target,
			editType: EditType.TEXT,
			newValue: { text: newText },
			oldValue: { text: this.oldText }
		});
	}

	stopBubbling = (e) => e.key != "Escape" && e.stopPropagation();

	removeEditability = ({ target }) => {
		target.classList.remove(ONLOOK_EDITABLE);
		target.removeAttribute("contenteditable");
		target.removeAttribute("spellcheck");
		target.removeEventListener("blur", this.removeEditability);
		target.removeEventListener("keydown", this.stopBubbling);
		target.removeEventListener("input", this.handleInput);
		this.oldText = undefined;
		this.selectorEngine.editingStore.set(undefined);
	};

	insertElement = (el: HTMLElement) => {
		if (!el) return;
		const selected = this.selectorEngine.selected;
		if (selected.length == 0) return
		const selectedEl = selected[0];
		// Insert element into childrens list 
		selectedEl.appendChild(el);

		// Emit event
		const serializer = new XMLSerializer();
		const xmlStr = serializer.serializeToString(el);
		const position = Array.from(selectedEl.children).indexOf(el);
		handleEditEvent({
			el: selectedEl,
			editType: EditType.INSERT,
			newValue: { childContent: xmlStr, childSelector: getUniqueSelector(el), position: `${position}` } as InsertRemoveVal,
			oldValue: {}
		});
	};

	copyElement = () => {
		const selected = this.selectorEngine.selected;
		if (selected.length == 0) return;
		this.copiedElement = selected[0]
	};

	pasteElement = () => {
		if (!this.copiedElement) return;
		const clonedElement = this.copiedElement.cloneNode(true) as HTMLElement;
		this.insertElement(clonedElement);
		this.simulateClick([clonedElement]);
	};

	deleteElement = () => {
		const selected = this.selectorEngine.selected;
		if (selected.length == 0) return;
		selected.forEach((el) => {
			const serializer = new XMLSerializer();
			const xmlStr = serializer.serializeToString(el);
			const parent = el.parentElement;
			const position = Array.from(parent.children).indexOf(el);
			handleEditEvent({
				el: parent,
				editType: EditType.REMOVE,
				newValue: { removed: getUniqueSelector(el) },
				oldValue: { childContent: xmlStr, childSelector: getUniqueSelector(el), position: `${position}` } as InsertRemoveVal,
			});
			el.remove()
		});
	};
}
