<script lang="ts">
  import type { EditTool } from "$lib/tools/edit";
  import { Plus, MagnifyingGlass, Text } from "radix-icons-svelte";
  export let editTool: EditTool;
  let hovered = false;
</script>

<div class="flex flex-col text-xs space-y-2">
  <label
    class="flex flex-row items-center text-text bg-stone-900 rounded p-2 space-x-2"
  >
    <MagnifyingGlass class="pointer-events-none w-4 h-4 opacity-60" />
    <input
      type="text"
      placeholder="Search for an element"
      class="form-input bg-transparent border-none appearance-none flex-grow focus:outline-none"
    />
  </label>

  <p class="opacity-60">Primitive Elements</p>

  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div
    class="flex flex-row p-1 rounded items-center space-x-2 cursor-pointer transition {hovered
      ? 'bg-red/20'
      : ''}"
    on:mouseenter={() => (hovered = true)}
    on:mouseleave={() => (hovered = false)}
  >
    <div
      class="w-8 h-8 rounded flex items-center justify-center transition {hovered
        ? 'bg-red/20'
        : 'bg-stone-800'}"
    >
      <Text class="w-4 h-4" />
    </div>
    <div class="flex flex-col flex-grow">
      <p class="transition {hovered ? 'text-red' : ''}">Title</p>
      <p class="opacity-60 transition {hovered ? 'text-red' : ''}">Subtile</p>
    </div>
    {#if hovered}
      <Plus class="w-4 h-4 text-red" />
    {/if}
  </div>
</div>
