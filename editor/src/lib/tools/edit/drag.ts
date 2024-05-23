import Sortable from 'sortablejs';
import type { OverlayManager } from '../selection/overlay';
import type { SelectorEngine } from '../selection/selector';

export class DragManager {
    selectedSnapshot: HTMLElement[] = [];
    dragContainers: WeakMap<HTMLElement, any> = new WeakMap();

    constructor(
        private selectorEngine: SelectorEngine,
        private overlayManager: OverlayManager,
        private updateClickedRects: (elements: HTMLElement[]) => void
    ) {
        // Make selected elements draggable within parents
        this.selectorEngine.selectedStore.subscribe((value) => {
            const added = value.filter((el) => this.selectedSnapshot.includes(el) === false);
            const removed = this.selectedSnapshot.filter((el) => value.includes(el) === false);

            // Remove container drag and drop
            removed.forEach((el) => {
                if (!el) return;
                const parent = el.parentElement;
                if (!parent) return;
                this.removeDraggable(parent);
            });

            // Make container drag and drop
            added.forEach((el) => {
                if (!el || el === document.body || el === document.documentElement) return;
                // Make parent draggable container
                const parent = el.parentElement;
                if (!parent) return;
                this.makeDraggable(parent);
            });

            this.selectedSnapshot = value;
        });
    }
    // Consider moving this to helper
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
}