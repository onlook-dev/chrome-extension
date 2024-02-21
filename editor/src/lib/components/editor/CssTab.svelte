<script lang="ts">
  import {
    ElementStyle,
    ElementStyleGroup,
    ElementStyleType,
    getElementComputedStylesData,
    groupElementStylesByGroup,
  } from "$lib/tools/selection/styles";
  import { emitStyleChangeEvent } from "$lib/tools/edit/emit";
  import * as Accordion from "$lib/components/ui/accordion";
  import { Input } from "$lib/components/ui/input";
  import Separator from "../ui/separator/separator.svelte";
  import SelectInput from "./inputs/SelectInput.svelte";
  import ColorInput from "./inputs/ColorInput.svelte";
  import NumberUnitInput from "./inputs/NumberUnitInput.svelte";
  import TagInfo from "./inputs/TagInfo.svelte";
  import SizeSection from "./inputs/SizeSection.svelte";
  import SpacingInput from "./inputs/SpacingInput.svelte";
  import type { EditTool } from "$lib/tools/edit";
  import { onDestroy, onMount } from "svelte";

  export let editTool: EditTool;
  let el: HTMLElement | undefined = undefined;
  let groupedStyles: Record<ElementStyleGroup, ElementStyle[]> = {
    [ElementStyleGroup.Size]: [],
    [ElementStyleGroup.Position]: [],
    [ElementStyleGroup.Style]: [],
    [ElementStyleGroup.Text]: [],
    [ElementStyleGroup.Spacing]: [],
    [ElementStyleGroup.Effects]: [],
  };
  let unsubs: (() => void)[] = [];

  onMount(() => {
    unsubs.push(
      editTool.selectorEngine.selectedStore.subscribe(selectedElementsChanged)
    );
  });

  onDestroy(() => {
    unsubs.forEach((unsub) => unsub());
  });

  function selectedElementsChanged(selected: HTMLElement[]) {
    // TODO: Handle multiple elements. Show similar values and leave non-similar ones blank
    el = selected[0];
    if (el) {
      const computedStyles = getElementComputedStylesData(el);
      groupedStyles = groupElementStylesByGroup(computedStyles);
    }
  }

  function updateElementStyle(key, value) {
    editTool.selectorEngine.selected.forEach((element) => {
      const oldStyle = element.style[key];
      element.style[key] = value;
      // Emit event
      emitStyleChangeEvent(element, key, { [key]: value }, { [key]: oldStyle });
    });
  }
</script>

{#if el}
  <Accordion.Root class="w-full" multiple value={Object.keys(groupedStyles)}>
    {#each Object.entries(groupedStyles) as [groupKey, elementStyles]}
      {#if groupKey == ElementStyleGroup.Size}
        <SizeSection {elementStyles} {updateElementStyle} />
        <Separator class="mt-4" />
      {:else if groupKey == ElementStyleGroup.Spacing}
        <Accordion.Item data-state="open" value={groupKey}>
          <Accordion.Trigger
            ><h2 class="text-xs">
              {groupKey}
            </h2></Accordion.Trigger
          >
          <Accordion.Content>
            <SpacingInput {elementStyles} {updateElementStyle} />
          </Accordion.Content>
        </Accordion.Item>
      {:else}
        <Accordion.Item data-state="open" value={groupKey}>
          <Accordion.Trigger
            ><h2 class="text-xs font-semibold">
              {groupKey}
            </h2></Accordion.Trigger
          >
          <Accordion.Content>
            {#if groupKey == ElementStyleGroup.Text}
              <TagInfo {el} />
            {/if}
            {#each elementStyles as elementStyle, i}
              <div class="flex flex-row items-center {i === 0 ? '' : 'mt-4'}">
                <p class="text-xs w-24 mr-2 text-start opacity-60">
                  {elementStyle.displayName}
                </p>
                <div class="text-end ml-auto">
                  {#if elementStyle.type === ElementStyleType.Select}
                    <SelectInput {elementStyle} {updateElementStyle} />
                  {:else if elementStyle.type === ElementStyleType.Color}
                    <ColorInput {elementStyle} {updateElementStyle} />
                  {:else if elementStyle.type === ElementStyleType.Number}
                    <NumberUnitInput
                      inputWidth="w-12"
                      unitWidth="w-6"
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
                        updateElementStyle(
                          elementStyle.key,
                          event.currentTarget.value
                        );
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
{/if}
