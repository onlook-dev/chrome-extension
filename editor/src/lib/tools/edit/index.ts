import { DATA_ONLOOK_COMPONENT_ID } from '$lib/constants';
import { editorPanelVisible, elementsPanelVisible, layersWeakMap, } from '$lib/states/editor';
import { DATA_ONLOOK_ID } from '$shared/constants';
import { getCustomComponentContent } from '$shared/helpers';
import { EditType, type ChildVal } from '$shared/models';
import { nanoid } from 'nanoid';
import { OverlayManager } from '../selection/overlay';
import { SelectorEngine } from '../selection/selector';
import { findCommonParent, getDataOnlookComponentId, getDataOnlookId, getUniqueSelector } from '../utilities';
import { ApplyChangesService } from './applyChange';
import { DragManager } from './drag';
import { handleEditEvent } from './handleEvents';

import type { Tool } from '../index';

export class EditTool implements Tool {
	selectorEngine: SelectorEngine;
	overlayManager: OverlayManager;
	applyChangeService: ApplyChangesService;
	dragManager: DragManager;

	elResizeObserver: ResizeObserver;
	oldText: string | undefined;
	copiedElements: HTMLElement[] = [];
	lastKnownScrollPosition = 0;
	ticking = false;

	constructor() {
		this.selectorEngine = new SelectorEngine();
		this.overlayManager = new OverlayManager();
		this.applyChangeService = new ApplyChangesService();
		this.dragManager = new DragManager(this.selectorEngine, this.overlayManager, this.updateClickedRects.bind(this));

		// Initialize resize observer for click element resize
		this.elResizeObserver = new ResizeObserver(entries => {
			const observedElements = entries.map(entry => entry.target);
			this.onElementResize(observedElements);
		});
		window.addEventListener('resize', this.onScreenResize.bind(this));
		window.addEventListener('scroll', this.onScreenResize.bind(this));
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
		this.selectorEngine.handleClick(e);

		// If clicked on an editing element, ignore click
		if (this.isClickedElementEditable()) return;

		this.overlayManager.clear();
		this.elResizeObserver.disconnect();

		this.selectorEngine.selected.forEach((el) => {
			this.overlayManager.addClickRect(el);
			this.elResizeObserver.observe(el);
		});
	}

	isClickedElementEditable = () => {
		if (this.selectorEngine.selected.length !== 1) return false;
		return this.selectorEngine.selected[0] === this.selectorEngine.editing;
	};

	onDoubleClick(e: MouseEvent): void {
		if (this.selectorEngine.editing) this.removeEditability({ target: this.selectorEngine.editing });
		this.overlayManager.clear();
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

	simulateMove = (el: HTMLElement, newIndex: number) => {
		this.dragManager.move(layersWeakMap.get(el), newIndex);
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

	addEditability = (el: HTMLElement) => {
		if (!el) return;
		this.oldText = el.textContent;
		el.setAttribute("contenteditable", "true");
		el.setAttribute("spellcheck", "true");
		el.focus();

		el.addEventListener("keydown", this.stopBubbling);
		el.addEventListener("blur", this.removeEditability);
		el.addEventListener("input", this.handleInput);
		this.overlayManager.updateEditRect(el);
	}

	removeEditability = ({ target }) => {
		target.removeAttribute("contenteditable");
		target.removeAttribute("spellcheck");
		target.removeEventListener("blur", this.removeEditability);
		target.removeEventListener("keydown", this.stopBubbling);
		target.removeEventListener("input", this.handleInput);
		this.oldText = undefined;
		this.selectorEngine.editingStore.set(undefined);
		this.overlayManager.removeEditRect();
	};

	insertElement = (el: HTMLElement) => {
		if (!el) return;
		const selected = this.selectorEngine.selected;
		if (selected.length == 0) return
		const parent = selected[0];

		// Insert element into childrens list 
		parent.appendChild(el);
		const child = parent.lastElementChild;

		// Emit event
		const childIndex = Array.from(parent.children).indexOf(child).toString();
		this.handleStructureChange(child, parent, EditType.INSERT_CHILD, childIndex)
	};

	copyElements = () => {
		const selected = this.selectorEngine.selected;
		if (selected.length == 0) return;
		const clonedElements = selected.map((el) => this.cloneElement(el));
		this.copiedElements = clonedElements;
	};

	cloneElement = (el) => {
		const clonedElement = el.cloneNode(true) as HTMLElement;
		clonedElement.removeAttribute(DATA_ONLOOK_ID);
		clonedElement.removeAttribute(DATA_ONLOOK_COMPONENT_ID);
		clonedElement.setAttribute(DATA_ONLOOK_COMPONENT_ID, `${clonedElement.tagName.toLowerCase()}-${nanoid()}`)
		return clonedElement;
	};

	cutElements = () => {
		this.copyElements();
		this.deleteElements();
	}

	pasteElements = () => {
		if (!this.copiedElements.length) return;
		this.copiedElements.forEach((el) => { this.insertElement(el); })

		// Clone so that it can be pasted again
		const clonedCopiedElements = this.copiedElements.map((el) => this.cloneElement(el));
		this.copiedElements = clonedCopiedElements;
	};

	deleteElements = () => {
		const selected = this.selectorEngine.selected;
		if (selected.length == 0) return;
		selected.forEach((child) => {
			const componentId = getDataOnlookComponentId(child);
			if (componentId) {
				this.deleteCustomElement(child);
			} else {
				this.applyChangeService.applyStyle(child, 'display', 'none');
			}
		});
	};

	deleteCustomElement = (child: HTMLElement) => {
		const parent = child.parentElement;
		const childIndex = Array.from(parent.children).indexOf(child).toString();
		parent.removeChild(child);
		this.handleStructureChange(child, parent, EditType.REMOVE_CHILD, childIndex)
	}

	handleStructureChange = (child, parent, editType, index?: string) => {
		const content = getCustomComponentContent(child)
		const selector = getUniqueSelector(child);
		const path = getDataOnlookId(child);
		const componentId = getDataOnlookComponentId(child);
		const deleteVal = {
			selector,
			path,
			index,
			componentId,
			content: '',
		} as ChildVal;

		const insertVal = {
			selector,
			path,
			index,
			componentId,
			content,
		} as ChildVal;

		// These are the same, just flipped
		handleEditEvent({
			el: parent,
			editType,
			newValue: editType === EditType.REMOVE_CHILD ? deleteVal : insertVal,
			oldValue: editType === EditType.REMOVE_CHILD ? insertVal : deleteVal
		});
	}
}
