import type { Tool } from '../index';
import {
	updateClickRect,
	updateHoverRect,
	removeClickedRect,
	removeHoverRect
} from '../selection/rect';
import type EditorPanel from '$lib/components/editor/EditorPanel.svelte';

export class EditTool implements Tool {
	editorPanel: EditorPanel;
	clickedElement: HTMLElement;
	hoveredElement: HTMLElement;
	resizeObserver: ResizeObserver;

	constructor(editorPanel) {
		this.editorPanel = editorPanel;
	}

	onInit() { }

	onDestroy() {
		this.editorPanel.setVisible(false);
		removeClickedRect();
		removeHoverRect();
		this.clickedElement = null;
		this.hoveredElement = null;
	}

	onMouseOver(el: HTMLElement): void {
		this.hoveredElement = el;
		updateHoverRect(el);
	}

	onMouseOut(e: HTMLElement): void {
		this.hoveredElement = null;
		removeHoverRect();
	}

	onClick(el: HTMLElement): void {
		this.clickedElement = el;
		this.editorPanel.setVisible(true);
		this.editorPanel.setElement(el);
		removeClickedRect();
		updateClickRect(el);
		// const onlookId = getDataOnlookId(el);

		// ResizeObserver to watch size changes
		if (this.resizeObserver) this.resizeObserver.disconnect();
		this.resizeObserver = new ResizeObserver(entries => {
			for (let entry of entries) {
				updateClickRect(entry.target);
			}
		});
		this.resizeObserver.observe(el);
	}
}
