<script lang="ts">
  import type { EditTool } from "$lib/tools/edit";
  import { LayersManager } from "$lib/tools/layers";
  import { onMount } from "svelte";
  import TreeRoot from "./dom/TreeRoot.svelte";
  import { DATA_ONLOOK_SELECTOR } from "$lib/constants";
  import { getUniqueSelector } from "$lib/tools/utilities";

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
    htmlDoc = parser.parseFromString(layersManager?.domTree, "text/html");
    tree = htmlDoc.body;

    editTool.selectorEngine.selectedStore.subscribe(handleNewSelections);
    editTool.selectorEngine.hoveredStore.subscribe(handleNewHover);
  });

  function select(e: Event, node: HTMLElement) {
    if (selected == node) return;
    selected = node;
  }

  function mouseEnter(e: Event, node: HTMLElement) {
    if (hovered == node) return;
    hovered = node;
  }

  function mouseLeave(e: Event) {
    hovered = undefined;
  }

  function handleNewHover(el: HTMLElement) {
    if (!el) {
      hovered = undefined;
      return;
    }
    const selector = getUniqueSelector(el);
    const hoveredEl = htmlDoc?.querySelector(
      `[${DATA_ONLOOK_SELECTOR}="${selector}"]`
    );
    if (hoveredEl) {
      hovered = hoveredEl as HTMLElement;
    }
  }

  function handleNewSelections(els: HTMLElement[]) {
    if (els.length == 0) {
      selected = undefined;
      return;
    }
    const selector = getUniqueSelector(els[0]);
    const selectedEl = htmlDoc?.querySelector(
      `[${DATA_ONLOOK_SELECTOR}="${selector}"]`
    );
    if (selectedEl) {
      selected = selectedEl as HTMLElement;
    }
  }
</script>

{#if tree}
  <div class="text-xs">
    <TreeRoot
      node={tree}
      {hovered}
      {selected}
      {select}
      {mouseEnter}
      {mouseLeave}
    />
  </div>
{/if}
