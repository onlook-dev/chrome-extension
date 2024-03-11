<script lang="ts">
  import { Angle, Corners } from "radix-icons-svelte";
  import type { ElementStyle } from "$lib/tools/selection/styles";
  import NumberUnitInput from "./NumberUnitInput.svelte";

  export let elementStyles: ElementStyle[] = [];
  export let updateElementStyle = (key: string, value: string) => {};
</script>

<div class="mt-4 grid grid-cols-2 gap-x-4">
  <h2 class="pb-2 text-xs">Fixed Width</h2>
  <h2 class="pb-2 text-xs">Fixed Height</h2>
  {#each elementStyles as elementStyle}
    <div class="flex flex-row items-center pb-2">
      <div class="w-24">
        {#if elementStyle.key === "rotate"}
          <Angle class="w-4 h-4 opacity-60" />
        {:else if elementStyle.key === "borderRadius"}
          <Corners class="w-4 h-4 opacity-60" />
        {:else}
          <p class="text-xs text-left opacity-60">
            {elementStyle.displayName}
          </p>
        {/if}
      </div>

      <NumberUnitInput {elementStyle} {updateElementStyle} />
    </div>
  {/each}
</div>
