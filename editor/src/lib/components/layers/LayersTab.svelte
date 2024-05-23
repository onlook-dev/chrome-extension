<script lang="ts">
  import { onMount } from "svelte";
  import type { EditTool } from "$lib/tools/edit";
  import TreeRoot from "./dom/TreeRoot.svelte";
  import Separator from "../ui/separator/separator.svelte";

  export let editTool: EditTool;

  let hovered: HTMLElement;
  let selected: HTMLElement[] = [];
  let htmlDoc: Document;
  let tree: HTMLElement;

  onMount(() => {
    htmlDoc = document;
    tree = htmlDoc.body;
    editTool.selectorEngine.selectedStore.subscribe(handleNewSelections);
    editTool.selectorEngine.hoveredStore.subscribe(handleNewHover);
  });

  function select(e: Event | any, node: HTMLElement) {
    if (e.shiftKey) {
      if (selected.includes(node)) {
        selected = selected.filter((el) => el !== node);
      } else {
        selected = [...selected, node];
      }
    } else {
      selected = [node];
    }
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
    if (!els || els.length == 0) {
      selected = [];
      return;
    }
    selected = els;
  }
</script>

<div>
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
</div>
