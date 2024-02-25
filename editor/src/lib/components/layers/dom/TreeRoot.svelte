<script lang="ts">
  import { onMount } from "svelte";
  import DOMTreeNode from "./TreeNode.svelte";

  export let node: HTMLElement | undefined;
  export let selected: HTMLElement | undefined;
  export let hovered: HTMLElement | undefined;

  export let select: (e: Event, node: HTMLElement) => void;
  export let mouseEnter: (e: Event, node: HTMLElement) => void;
  export let mouseLeave: (e: Event) => void;

  let internalHover = false;
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
{#if node}
  <div
    class="select-none text-xs text-white/60"
    on:mouseleave|preventDefault={(e) => {
      internalHover = false;
      mouseLeave(e);
    }}
    on:mouseenter={() => (internalHover = true)}
  >
    <DOMTreeNode
      bind:node
      {selected}
      {hovered}
      {select}
      {mouseEnter}
      {internalHover}
    />
  </div>
{/if}
