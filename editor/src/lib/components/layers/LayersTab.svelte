<script lang="ts">
  import type { EditTool } from "$lib/tools/edit";
  import { LayersManager } from "$lib/tools/layers";
  import { onMount } from "svelte";

  export let editTool: EditTool;
  let layersManager: LayersManager;

  onMount(() => {
    layersManager = new LayersManager();
  });
</script>

{#if layersManager?.domTree}
  <div class="text-xs">
    {layersManager.domTree}
  </div>
{/if}
