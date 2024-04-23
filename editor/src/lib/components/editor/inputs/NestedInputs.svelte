<script lang="ts">
  import {
    BorderAll,
    BorderBottom,
    BorderLeft,
    BorderRight,
    BorderTop,
    CornerBottomLeft,
    CornerBottomRight,
    CornerTopLeft,
    CornerTopRight,
    Corners,
  } from "radix-icons-svelte";
  import { slide } from "svelte/transition";

  import TextInput from "./TextInput.svelte";
  import * as ToggleGroup from "$lib/components/ui/toggle-group";

  import type { ElementStyle } from "$lib/tools/selection/styles";

  export let elementStyles: ElementStyle[] = [];
  export let updateElementStyle = (
    key: string,
    value: string,
    refresh?: boolean,
  ) => {};
  $: showGroup = !elementStyles.every(
    (style) => style.value === elementStyles[0].value,
  );

  let updatedUpdateStyle = (key: string, value: string) => {
    updateElementStyle(key, value, true);
  };
</script>

<div class="grid grid-cols-2 gap-2 my-2">
  {#each elementStyles as elementStyle}
    {#if elementStyle.key === "margin" || elementStyle.key === "padding" || elementStyle.key === "borderRadius"}
      <div class="flex flex-row items-center col-span-2">
        <p class="text-xs text-left text-tertiary">
          {elementStyle.displayName}
        </p>
        <div class="ml-auto h-8 flex flex-row w-32 space-x-2">
          <TextInput {elementStyle} updateElementStyle={updatedUpdateStyle} />
          <ToggleGroup.Root
            size="sm"
            type="single"
            value={showGroup ? "true" : "false"}
            onValueChange={(val) => {
              if (!val) return;
              showGroup = val === "true";
            }}
          >
            <ToggleGroup.Item value="false"
              ><BorderAll class="w-4 h-5" /></ToggleGroup.Item
            >
            <ToggleGroup.Item value="true"
              ><Corners class="w-4 h-5" /></ToggleGroup.Item
            >
          </ToggleGroup.Root>
        </div>
      </div>
    {:else if showGroup}
      <div transition:slide class="flex flex-row items-center">
        <div class="w-12 text-tertiary">
          {#if elementStyle.displayName === "Top"}
            <BorderTop class="w-4 h-4" />
          {:else if elementStyle.displayName === "Bottom"}
            <BorderBottom class="w-4 h-4 0" />
          {:else if elementStyle.displayName === "Right"}
            <BorderRight class="w-4 h-4 " />
          {:else if elementStyle.displayName === "Left"}
            <BorderLeft class="w-4 h-4 " />
          {:else if elementStyle.displayName === "Top Right"}
            <CornerTopRight class="w-4 h-4 0" />
          {:else if elementStyle.displayName === "Top Left"}
            <CornerTopLeft class="w-4 h-4 " />
          {:else if elementStyle.displayName === "Bottom Right"}
            <CornerBottomRight class="w-4 h-4 " />
          {:else if elementStyle.displayName === "Bottom Left"}
            <CornerBottomLeft class="w-4 h-4 " />
          {:else}
            <p class="text-xs text-left">
              {elementStyle.displayName}
            </p>
          {/if}
        </div>
        <TextInput {elementStyle} updateElementStyle={updatedUpdateStyle} />
      </div>
    {/if}
  {/each}
</div>
