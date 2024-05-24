import Sortable from 'sortablejs';
import type { OverlayManager } from '../selection/overlay';
import type { SelectorEngine } from '../selection/selector';
import { writable, type Writable } from 'svelte/store';

export class DragManager {
    selectedSnapshot: HTMLElement[] = [];
    dragContainers: WeakMap<HTMLElement, any> = new WeakMap();
    eventsStore: Writable<{ el: HTMLElement, newIndex: number } | null> = writable(null);

    constructor(
        private selectorEngine: SelectorEngine,
        private overlayManager: OverlayManager,
        private updateClickedRects: (elements: HTMLElement[]) => void
    ) {
        // Make selected elements draggable within parents
        this.selectorEngine.selectedStore.subscribe((els) => {
            const added = els.filter((el) => this.selectedSnapshot.includes(el) === false);
            const removed = this.selectedSnapshot.filter((el) => els.includes(el) === false);

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

            this.selectedSnapshot = els;
        });
    }

    move(el: HTMLElement, newIndex: number): void {
        const parent = el.parentElement;
        if (!parent) return;
        const container = this.dragContainers.get(parent);
        if (!container) return;

        const order = container.toArray();
        const oldIndex = Array.prototype.indexOf.call(parent.children, el);

        if (oldIndex === -1) return; // Element not found in the array

        // Move el to newIndex
        order.splice(newIndex, 0, order.splice(oldIndex, 1)[0]);
        container.sort(order, true);
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
            onChange: (e) => {
                // Send event to layers
                // editTool.simulateMove(layersWeakMap.get(e.item), e.newIndex);
                this.eventsStore.set({ el: e.item, newIndex: e.newIndex });
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