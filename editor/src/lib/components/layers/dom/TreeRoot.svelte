<script lang="ts">
  import { onMount } from "svelte";
  import DOMTreeNode from "./TreeNode.svelte";

  export let node: HTMLElement | undefined;
  export let selected: HTMLElement | undefined;
  export let hovered: HTMLElement | undefined;

  let mouseLeave = (e: any) => {
    hovered = undefined;
  };
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="select-none" on:mouseleave|preventDefault={mouseLeave}>
  {#if node}
    <DOMTreeNode bind:node bind:selected bind:hovered />
  {/if}
</div>
