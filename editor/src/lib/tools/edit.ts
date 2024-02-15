import type { Tool } from './tool';
import {
	updateClickRect,
	updateHoverRect,
	removeClickedRect,
	removeHoverRect
} from './selection/rect';
import { getDataOnlookId } from './utilities';
import { getElementComputedStylesData } from './selection/styles';
import type EditorPanel from '$lib/components/codeEditor/EditorPanel.svelte';

export class EditTool implements Tool {
	editorPanel: EditorPanel;
	clickedElement: Element;
	hoveredElement: Element;
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

	onMouseOver(el: Element): void {
		this.hoveredElement = el;
		updateHoverRect(el);
	}

	onMouseOut(e: Element): void {
		this.hoveredElement = null;
		removeHoverRect();
	}

	onClick(el: Element): void {
		this.clickedElement = el;
		this.editorPanel.setVisible(true);
		this.editorPanel.setElement(el);
		removeClickedRect();
		updateClickRect(el);
		// 		const onlookId = getDataOnlookId(el);


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
