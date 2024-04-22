<script lang="ts">
  import * as ToggleGroup from "$lib/components/ui/toggle-group";
  import type { ElementStyle } from "$lib/tools/selection/styles";
  import {
    ChevronDown,
    TextAlignCenter,
    TextAlignLeft,
    TextAlignRight,
    BorderSolid,
    BorderDashed,
    BorderDotted,
    ArrowRight,
    ArrowDown,
  } from "radix-icons-svelte";

  export let elementStyle: ElementStyle;
  export let updateElementStyle: (
    key: string,
    value: string,
    refresh?: boolean,
  ) => void;
</script>

{#if elementStyle}
  {#if elementStyle.options.length < 4}
    <ToggleGroup.Root
      class="w-32 overflow-hidden"
      size="sm"
      type="single"
      value={elementStyle.value}
      onValueChange={(val) => {
        if (!val) {
          return;
        }
        updateElementStyle(elementStyle.key, val);
      }}
    >
      {#each elementStyle.options ?? [] as option}
        <ToggleGroup.Item class="capitalize text-xs" value={option}>
          {#if option === "start"}
            <TextAlignLeft />
          {:else if option === "center"}
            <TextAlignCenter />
          {:else if option === "end"}
            <TextAlignRight />
          {:else if option === "solid"}
            <BorderSolid />
          {:else if option === "dashed"}
            <BorderDashed />
          {:else if option === "dotted"}
            <BorderDotted />
          {:else if option === "row"}
            <ArrowRight />
          {:else if option === "column"}
            <ArrowDown />
          {:else}
            {option}
          {/if}
        </ToggleGroup.Item>
      {/each}
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
