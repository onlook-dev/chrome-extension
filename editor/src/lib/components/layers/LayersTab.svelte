<script lang="ts">
  import type { EditTool } from "$lib/tools/edit";
  import { LayersManager } from "$lib/tools/layers";
  import { onMount } from "svelte";
  import TreeRoot from "./dom/TreeRoot.svelte";
  import { getUniqueSelector } from "$lib/tools/utilities";
  import { DATA_ONLOOK_SELECTOR } from "$lib/constants";

  export let editTool: EditTool;

  let layersManager: LayersManager;
  let hovered: HTMLElement;
  let selected: HTMLElement;
  let parser: DOMParser;

  let htmlDoc: Document;
  let tree: HTMLElement;

  onMount(() => {
    layersManager = new LayersManager();
    parser = new DOMParser();
    htmlDoc = layersManager.clonedDocument;
    tree = htmlDoc.body;

    editTool.selectorEngine.selectedStore.subscribe(handleNewSelections);
    editTool.selectorEngine.hoveredStore.subscribe(handleNewHover);
  });

  function select(e: Event, node: HTMLElement) {
    if (selected == node) return;
    selected = layersManager?.getOriginalNode(node) as HTMLElement;
    editTool.simulateClick(selected);
  }

  function mouseEnter(e: Event, node: HTMLElement) {
    if (hovered == node) return;
    hovered = layersManager?.getOriginalNode(node) as HTMLElement;
    editTool.simulateHover(hovered);
  }

  function mouseLeave(e: Event) {
    hovered = undefined;
    editTool.simulateOut();
  }

  function handleNewHover(el: HTMLElement) {
    if (!el) {
      hovered = undefined;
      return;
    }
    const hoveredEl = layersManager?.getSanitizedNode(el);
    if (hoveredEl) {
      hovered = hoveredEl as HTMLElement;
    }
  }

  function handleNewSelections(els: HTMLElement[]) {
    if (els.length == 0) {
      selected = undefined;
      return;
    }
    const selectedEl = layersManager?.getSanitizedNode(els[0]);
    if (selectedEl) {
      selected = selectedEl as HTMLElement;
    }
  }
</script>

{#if tree}
  <TreeRoot
    node={tree}
    {hovered}
    {selected}
    {select}
    {mouseEnter}
    {mouseLeave}
  />
{/if}
