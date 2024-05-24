import { writable, type Writable } from 'svelte/store';
import { handleEditEvent } from "$lib/tools/edit/handleEvents";
import { EditType } from "$shared/models";
import { getUniqueSelector } from "$lib/tools/utilities";

import type { OverlayManager } from '../selection/overlay';
import type { SelectorEngine } from '../selection/selector';
import type { MoveVal } from "$shared/models/editor";

import Sortable from 'sortablejs';
import { dragContainers } from '$lib/states/editor';

export class DragManager {
    selectedSnapshot: HTMLElement[] = [];
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
        const container = dragContainers.get(parent);
        if (!container) return;

        const order = container.toArray();
        const oldIndex = Array.prototype.indexOf.call(parent.children, el);

        if (oldIndex === -1) return; // Element not found in the array

        // Remove the element from the old position
        const [movedElement] = order.splice(oldIndex, 1);

        // Insert the element to the new position
        order.splice(newIndex, 0, movedElement);
        container.sort(order, true);

        // Send edit event
        this.handleMoveEvent(el, oldIndex, newIndex);
    }

    makeDraggable(el: HTMLElement) {
        if (dragContainers.has(el)) return;
        const container = Sortable.create(el, {
            animation: 150,
            easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
            onStart: (e) => {
                this.overlayManager.hideHoverRect();
                this.overlayManager.removeClickedRects();
            },
            onChange: (e) => {
                // Send event to layers
                this.eventsStore.set({ el: e.item, newIndex: e.newIndex });
            },
            onEnd: (e) => {
                // Refresh overlay
                this.updateClickedRects(this.selectorEngine.selected);
                this.overlayManager.showHoverRect();
                this.handleMoveEvent(e.item, e.oldIndex, e.newIndex);
            }
        });
        dragContainers.set(el, container);
    }

    removeDraggable(el: HTMLElement) {
        const container = dragContainers.get(el);
        container && container.destroy();
        dragContainers.delete(el);
    }

    handleMoveEvent(el, oldIndex, newIndex) {
        handleEditEvent({
            el,
            editType: EditType.MOVE,
            newValue: {
                parentSelector: getUniqueSelector(el.parentNode as HTMLElement),
                index: newIndex,
            } as MoveVal,
            oldValue: {
                parentSelector: getUniqueSelector(el.parentNode as HTMLElement),
                index: oldIndex,
            } as MoveVal,
        });
    }
}