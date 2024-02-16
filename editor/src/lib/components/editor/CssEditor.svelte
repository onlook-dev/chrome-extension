<script lang="ts">
  import {
    ElementStyle,
    ElementStyleGroup,
    ElementStyleType,
    getElementComputedStylesData,
    groupElementStylesByGroup,
  } from "$lib/tools/selection/styles";
  import * as Accordion from "$lib/components/ui/accordion";
  import SelectInput from "./inputs/SelectInput.svelte";
  import { Input } from "$lib/components/ui/input";
  import ColorInput from "./inputs/ColorInput.svelte";
  import NumberUnitInput from "./inputs/NumberUnitInput.svelte";
  import Separator from "../ui/separator/separator.svelte";

  export let el: HTMLElement;
  let groupedStyles: Record<string, ElementStyle[]> = {};

  $: if (el) {
    const elementStyles: ElementStyle[] = getElementComputedStylesData(el);
    groupedStyles = groupElementStylesByGroup(elementStyles);
  }

  function updateElementStyle(key, value) {
    el.style[key] = value;
  }
</script>

<Accordion.Root class="w-full" multiple value={Object.keys(groupedStyles)}>
  {#each Object.entries(groupedStyles) as [groupKey, elementStyles]}
    {#if groupKey == ElementStyleGroup.Size}
      <div class="mt-4 grid grid-cols-2">
        <h2 class="pb-2 text-xs">Fixed Width</h2>
        <h2 class="pb-2 text-xs">Fixed Height</h2>
        {#each elementStyles as elementStyle}
          <div class="flex flex-row items-center pb-2">
            <p class="text-xs font-light w-24 text-left opacity-60">
              {elementStyle.displayName}
            </p>
            <NumberUnitInput {elementStyle} {updateElementStyle} />
          </div>
        {/each}
      </div>
      <Separator class="mt-4" />
    {:else}
      <Accordion.Item data-state="open" value={groupKey}>
        <Accordion.Trigger
          ><h2 class="text-xs">
            {groupKey}
          </h2></Accordion.Trigger
        >
        <Accordion.Content>
          {#each elementStyles as elementStyle}
            <div class="flex flex-row items-center py-1">
              <p class="text-xs font-light w-24 mr-2 text-start opacity-60">
                {elementStyle.displayName}
              </p>
              <div class="text-end ml-auto">
                {#if elementStyle.type === ElementStyleType.Select}
                  <SelectInput {elementStyle} {updateElementStyle} />
                {:else if elementStyle.type === ElementStyleType.Color}
                  <ColorInput {elementStyle} {updateElementStyle} />
                {:else if elementStyle.type === ElementStyleType.Number}
                  <NumberUnitInput
                    unitEnd={true}
                    {elementStyle}
                    {updateElementStyle}
                  />
                {:else}
                  <Input
                    type="text"
                    placeholder={elementStyle.type}
                    class="w-24 text-xs"
                    value={elementStyle.value}
                    on:input={(event) => {
                      updateElementStyle(elementStyle.key, event.target.value);
                    }}
                  />
                {/if}
              </div>
            </div>
          {/each}
        </Accordion.Content>
      </Accordion.Item>
    {/if}
  {/each}
</Accordion.Root>
