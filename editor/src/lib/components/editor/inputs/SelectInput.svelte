<script lang="ts">
  import * as ToggleGroup from "$lib/components/ui/toggle-group";
  import type { ElementStyle } from "$lib/tools/selection/styles";
  import {
    ChevronDown,
    TextAlignCenter,
    TextAlignLeft,
    TextAlignRight,
  } from "radix-icons-svelte";

  export let elementStyle: ElementStyle;
  export let updateElementStyle: (key: string, value: string) => void;
</script>

{#if elementStyle}
  {#if elementStyle.key === "textAlign"}
    <ToggleGroup.Root
      class="w-32"
      type="single"
      value={elementStyle.value}
      onValueChange={(val) => {
        if (!val) {
          updateElementStyle(elementStyle.key, "inherit");
          return;
        }
        updateElementStyle(elementStyle.key, val);
      }}
    >
      <ToggleGroup.Item value="start"
        ><TextAlignLeft class="w-4 h-5" /></ToggleGroup.Item
      >
      <ToggleGroup.Item value="center"
        ><TextAlignCenter class="w-4 h-5" /></ToggleGroup.Item
      >
      <ToggleGroup.Item value="end"
        ><TextAlignRight class="w-4 h-5" /></ToggleGroup.Item
      >
    </ToggleGroup.Root>
  {:else}
    <div class="relative w-32">
      <select
        name={elementStyle.displayName}
        value={elementStyle.value}
        class="p-[6px] w-full px-2 text-start rounded border-none text-xs text-text bg-surface appearance-none focus:outline-none focus:ring-0 capitalize"
        on:input={(event) => {
          updateElementStyle(elementStyle.key, event.currentTarget.value);
        }}
      >
        {#if !elementStyle.options.includes(elementStyle.value)}
          <option value={elementStyle.value}>{elementStyle.value}</option>
        {/if}
        {#each elementStyle.options ?? [] as option}
          <option value={option}>{option}</option>
        {/each}
      </select>
      <div
        class="text-tertiary absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none"
      >
        <ChevronDown />
      </div>
    </div>
  {/if}
{/if}
