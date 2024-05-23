import { ONLOOK_EDITABLE } from '$lib/constants';
import { editorPanelVisible, elementsPanelVisible, } from '$lib/states/editor';
import { EditType, type InsertRemoveVal } from '$shared/models';
import { OverlayManager } from '../selection/overlay';
import { SelectorEngine } from '../selection/selector';
import { findCommonParent, getUniqueSelector } from '../utilities';
import { handleEditEvent } from './handleEvents';
import type { Tool } from '../index';
import Sortable from 'sortablejs';

export class EditTool implements Tool {
	selectorEngine: SelectorEngine;
	overlayManager: OverlayManager;
	elResizeObserver: ResizeObserver;
	oldText: string | undefined;
	copiedElement: HTMLElement | undefined;

	lastKnownScrollPosition = 0;
	ticking = false;

	selectedSnapshot: HTMLElement[] = [];
	dragContainers: WeakMap<HTMLElement, any> = new WeakMap();

	constructor() {
		this.selectorEngine = new SelectorEngine();
		this.overlayManager = new OverlayManager();
		// Initialize resize observer for click element resize
		this.elResizeObserver = new ResizeObserver(entries => {
			const observedElements = entries.map(entry => entry.target);
			this.onElementResize(observedElements);
		});
		window.addEventListener('resize', this.onScreenResize.bind(this));
		window.addEventListener('scroll', this.onScreenResize.bind(this));

		// Make selected elements draggable within parents
		this.selectorEngine.selectedStore.subscribe((value) => {
			const added = value.filter((i) => this.selectedSnapshot.includes(i) === false);
			const removed = this.selectedSnapshot.filter((i) => value.includes(i) === false);

			// Remove container drag and drop
			removed.forEach((i) => {
				this.removeDraggable(i);
				const parent = i.parentElement;
				if (!parent) return;
				this.removeDraggable(parent);
			});

			// Make container drag and drop
			added.forEach((i) => {
				// Make sure i is not body or html
				if (i === document.body || i === document.documentElement) return;
				this.makeDraggable(i);

				// Make parent draggable container
				const parent = i.parentElement;
				if (!parent) return;
				this.makeDraggable(parent);
			});

			this.selectedSnapshot = value;
		});
	}

	makeDraggable(el: HTMLElement) {
		if (this.dragContainers.has(el)) return;
		var container = Sortable.create(el, {
			animation: 150,
			easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
			onStart: (e) => {
				this.overlayManager.hideHoverRect();
				this.overlayManager.removeClickedRects();
			},
			onEnd: (e) => {
				// Refresh overlay
				this.updateClickedRects(this.selectorEngine.selected);
				this.overlayManager.showHoverRect();
			}
		});
		this.dragContainers.set(el, container);
	}

	removeDraggable(el: HTMLElement) {
		const container = this.dragContainers.get(el);
		container && container.destroy();
		this.dragContainers.delete(el);
	}

	onInit() {
		this.selectorEngine.select(document.body);
		editorPanelVisible.set(true);
	}

	onDestroy() {
		editorPanelVisible.set(false);
		elementsPanelVisible.set(false);
		this.overlayManager.clear();
		this.selectorEngine.clear();
		this.elResizeObserver.disconnect();
		window.removeEventListener('resize', this.onScreenResize.bind(this));
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
		// Interval to update after elements resize
		if (!this.ticking) {
			this.updateElementOverlay();
			this.ticking = true;
		}
	}

	onScroll(e: Event): void {
		if (window.scrollY === this.lastKnownScrollPosition) return;
		this.lastKnownScrollPosition = window.scrollY;

		if (!this.ticking) {
			this.updateElementOverlay();
			this.ticking = true;
		}
	}

	updateElementOverlay() {
		window.requestAnimationFrame(() => {
			this.overlayManager.updateHoverRect(this.selectorEngine.hovered);
			this.updateClickedRects(this.selectorEngine.selected);
			this.updateParentRect();

			this.ticking = false;
		});
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

		this.selectorEngine.clear();
		els.forEach((el) => {
			this.selectorEngine.select(el);
		});

		this.overlayManager.clear();
		this.elResizeObserver.disconnect();
		this.selectorEngine.selected.forEach((el) => {
			this.overlayManager.addClickRect(el);
			this.elResizeObserver.observe(el);
		});
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
		const componentId = el.dataset.onlookComponentId;
		handleEditEvent({
			el: selectedEl,
			editType: EditType.INSERT,
			newValue: { childContent: xmlStr, childSelector: getUniqueSelector(el), position: `${position}`, componentId } as InsertRemoveVal,
			oldValue: {}
		});
		this.simulateClick([el]);
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
			const componentId = el.dataset.onlookComponentId;
			if (componentId) {
				const serializer = new XMLSerializer();
				const xmlStr = serializer.serializeToString(el);
				const parent = el.parentElement;
				const position = Array.from(parent.children).indexOf(el);
				handleEditEvent({
					el: parent,
					editType: EditType.REMOVE,
					newValue: { removed: getUniqueSelector(el), componentId },
					oldValue: { childContent: xmlStr, childSelector: getUniqueSelector(el), position: `${position}`, componentId } as InsertRemoveVal,
				});
				el.remove()
			}
		});
	};
}
