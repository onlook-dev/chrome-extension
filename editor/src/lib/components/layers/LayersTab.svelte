<script lang="ts">
  import { onMount } from "svelte";
  import { writable, type Writable } from "svelte/store";
  import { layersSelected, layersHovered } from "$lib/states/editor";
  import type { EditTool } from "$lib/tools/edit";

  import TreeRoot from "./dom/TreeRoot.svelte";
  import Sortable from "sortablejs";

  export let editTool: EditTool;

  let htmlDoc: Document;
  let rootNode: HTMLElement;
  let treeNodesSelected: Writable<HTMLElement[]> = writable([]);
  let selectedSnapshot: HTMLElement[] = [];
  let dragContainers: WeakMap<HTMLElement, any> = new WeakMap();

  onMount(() => {
    htmlDoc = document;
    rootNode = htmlDoc.body;
    editTool.selectorEngine.selectedStore.subscribe(handleNewSelections);
    editTool.selectorEngine.hoveredStore.subscribe(handleNewHover);

    treeNodesSelected.subscribe((els) => {
      if (!els) return;
      const added = els.filter((el) => selectedSnapshot.includes(el) === false);
      const removed = selectedSnapshot.filter(
        (el) => els.includes(el) === false
      );

      // Remove container drag and drop
      removed.forEach((el) => {
        if (!el) return;
        const parent = el.parentElement;
        if (!parent) return;
        removeDraggable(parent);
      });

      // Make container drag and drop
      added.forEach((el) => {
        if (!el || el === document.body || el === document.documentElement)
          return;
        // Make parent draggable container
        const parent = el.parentElement;
        if (!parent) return;
        makeDraggable(parent);
      });

      selectedSnapshot = els;
    });
  });

  function select(e: Event | any, node: HTMLElement, treeNode: HTMLElement) {
    // Make tree node draggable within its parent
    // Send drag events to edit tool
    if (e.shiftKey) {
      if ($layersSelected.includes(node)) {
        $layersSelected = $layersSelected.filter((el) => el !== node);
        $treeNodesSelected = $treeNodesSelected.filter((el) => el !== treeNode);
      } else {
        $layersSelected = [...$layersSelected, node];
        $treeNodesSelected = [...$treeNodesSelected, treeNode];
      }
    } else {
      $layersSelected = [node];
      $treeNodesSelected = [treeNode];
    }
    editTool.simulateClick($layersSelected);
  }

  function mouseEnter(e: Event, node: HTMLElement) {
    if ($layersHovered == node) return;
    $layersHovered = node;
    editTool.simulateHover($layersHovered);
  }

  function mouseLeave(e: Event) {
    $layersHovered = undefined;
    editTool.simulateOut();
  }

  function handleNewHover(el: HTMLElement) {
    if (!el) {
      $layersHovered = undefined;
      return;
    }
    $layersHovered = el;
  }

  function handleNewSelections(els: HTMLElement[]) {
    if (!els || els.length == 0) {
      $layersSelected = [];
      return;
    }
    $layersSelected = els;
  }

  function makeDraggable(el: HTMLElement) {
    if (dragContainers.has(el)) return;
    var container = Sortable.create(el, {
      animation: 150,
      easing: "cubic-bezier(0.215, 0.61, 0.355, 1)",
      onStart: (e) => {},
      onUpdate: (e) => {
        // Send event to editor
      },
      onEnd: (e) => {
        // Send event to editor
      },
    });
    dragContainers.set(el, container);
  }

  function removeDraggable(el: HTMLElement) {
    const container = dragContainers.get(el);
    container && container.destroy();
    dragContainers.delete(el);
  }
</script>

<div>
  {#if rootNode}
    <TreeRoot node={rootNode} {select} {mouseEnter} {mouseLeave} />
  {/if}
</div>
