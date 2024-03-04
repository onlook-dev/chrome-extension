<script lang="ts">
  import type { EditTool } from "$lib/tools/edit";
  import { onMount } from "svelte";
  import TreeRoot from "./dom/TreeRoot.svelte";

  export let editTool: EditTool;

  let hovered: HTMLElement;
  let selected: HTMLElement;
  let htmlDoc: Document;
  let tree: HTMLElement;

  onMount(() => {
    htmlDoc = document;
    tree = htmlDoc.body;
    editTool.selectorEngine.selectedStore.subscribe(handleNewSelections);
    editTool.selectorEngine.hoveredStore.subscribe(handleNewHover);
  });

  function select(e: Event, node: HTMLElement) {
    if (selected == node) return;
    selected = node;
    editTool.simulateClick(selected);
  }

  function mouseEnter(e: Event, node: HTMLElement) {
    if (hovered == node) return;
    hovered = node;
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
    hovered = el;
  }

  function handleNewSelections(els: HTMLElement[]) {
    if (els.length == 0) {
      selected = undefined;
      return;
    }
    selected = els[0];
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
