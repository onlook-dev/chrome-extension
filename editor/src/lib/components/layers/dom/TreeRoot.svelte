<script lang="ts">
  import { onMount } from "svelte";
  import DOMTreeNode from "./TreeNode.svelte";

  export let node: HTMLElement | undefined;
  export let selected: HTMLElement | undefined;
  export let hovered: HTMLElement | undefined;

  export let select: (e: Event, node: HTMLElement) => void;
  export let mouseEnter: (e: Event, node: HTMLElement) => void;
  export let mouseLeave: (e: Event) => void;
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
  class="select-none text-xs text-white/60"
  on:mouseleave|preventDefault={mouseLeave}
>
  {#if node}
    <DOMTreeNode bind:node {selected} {hovered} {select} {mouseEnter} />
  {/if}
</div>
