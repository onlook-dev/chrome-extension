<script lang="ts">
  import { onMount } from "svelte";
  import { layersSelected, layersHovered } from "$lib/states/editor";
  import type { EditTool } from "$lib/tools/edit";
  import TreeRoot from "./dom/TreeRoot.svelte";

  export let editTool: EditTool;

  let htmlDoc: Document;
  let rootNode: HTMLElement;

  onMount(() => {
    htmlDoc = document;
    rootNode = htmlDoc.body;
    editTool.selectorEngine.selectedStore.subscribe(handleNewSelections);
    editTool.selectorEngine.hoveredStore.subscribe(handleNewHover);
  });

  function select(e: Event | any, node: HTMLElement) {
    if (e.shiftKey) {
      if ($layersSelected.includes(node)) {
        $layersSelected = $layersSelected.filter((el) => el !== node);
      } else {
        $layersSelected = [...$layersSelected, node];
      }
    } else {
      $layersSelected = [node];
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
</script>

<div>
  {#if rootNode}
    <TreeRoot node={rootNode} {select} {mouseEnter} {mouseLeave} />
  {/if}
</div>
