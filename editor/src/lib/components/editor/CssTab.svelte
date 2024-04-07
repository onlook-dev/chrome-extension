<script lang="ts">
  import {
    ElementStyle,
    ElementStyleGroup,
    ElementStyleType,
    getElementComputedStylesData,
    getImmediateTextContent,
    groupElementStylesByGroup,
  } from "$lib/tools/selection/styles";

  import { onDestroy, onMount } from "svelte";
  import { Input } from "$lib/components/ui/input";
  import { ApplyChangesService } from "$lib/tools/edit/applyChange";
  import type { EditTool } from "$lib/tools/edit";

  import * as Accordion from "$lib/components/ui/accordion";
  import Separator from "../ui/separator/separator.svelte";
  import SelectInput from "./inputs/SelectInput.svelte";
  import ColorInput from "./inputs/ColorInput.svelte";
  import NumberUnitInput from "./inputs/NumberUnitInput.svelte";
  import TagInfo from "./inputs/TagInfo.svelte";
  import SizeSection from "./inputs/SizeSection.svelte";
  import SpacingInput from "./inputs/SpacingInput.svelte";
  import TailwindInput from "./inputs/TailwindInput.svelte";

  export let editTool: EditTool;
  const applyChangeService = new ApplyChangesService();
  const custom = "Custom";
  let el: HTMLElement | undefined = undefined;
  let groupedStyles: Record<ElementStyleGroup, ElementStyle[]> = {
    [ElementStyleGroup.Size]: [],
    [ElementStyleGroup.Position]: [],
    [ElementStyleGroup.Style]: [],
    [ElementStyleGroup.Text]: [],
    [ElementStyleGroup.Spacing]: [],
    [ElementStyleGroup.Effects]: [],
  };
  let appendedClass: string[] = [];
  let unsubs: (() => void)[] = [];

  onMount(() => {
    unsubs.push(
      editTool.selectorEngine.selectedStore.subscribe(selectedElementsChanged),
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

      // Remove text group if no text content
      const immediateTextContent = getImmediateTextContent(el);
      if (!immediateTextContent || immediateTextContent === "") {
        delete groupedStyles[ElementStyleGroup.Text];
      }

      // TODO: This is a hack because for some reason, string assignment aren't always reactive when assigning empty string.
      // But arrays are always reactive on assignment.
      appendedClass = [applyChangeService.getUpdatedClasses(el)];
    }
  }

  function updateElementStyle(key, value) {
    editTool.selectorEngine.selected.forEach((el) => {
      applyChangeService.applyStyle(el, key, value);
    });
  }

  function updateElementClass(newClass) {
    editTool.selectorEngine.selected.forEach((el) => {
      applyChangeService.applyClass(el, newClass);
    });
  }
</script>

{#if el}
  <Accordion.Root
    class="w-full"
    multiple
    value={[...Object.keys(groupedStyles), custom]}
  >
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
                          event.currentTarget.value,
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
    <Accordion.Item data-state="open" value={custom}>
      <Accordion.Trigger><h2 class="text-xs">{custom}</h2></Accordion.Trigger>
      <Accordion.Content>
        <!-- <div class="space-y-2 px-1">
          <p class="text-xs w-24 mr-2 text-start opacity-60">CSS</p>
          <Textarea
            class="w-full text-xs break-normal"
            placeholder="background-color: red;
color: white;"
            on:input={(event) => {
              editTool.selectorEngine.selected.forEach((element) => {
                element.style.cssText = event.currentTarget.value;
              });
            }}
          />
        </div> -->
        <TailwindInput {updateElementClass} {appendedClass} />
      </Accordion.Content>
    </Accordion.Item>
  </Accordion.Root>
{/if}
