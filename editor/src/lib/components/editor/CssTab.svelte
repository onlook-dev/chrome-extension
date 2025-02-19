<script lang="ts">
  import {
    ElementStyle,
    ElementStyleGroup,
    ElementStyleSubGroup,
    ElementStyleType,
    getElementComputedStylesData,
    getImmediateTextContent,
    groupElementStylesByGroup,
  } from "$lib/tools/selection/styles";

  import { ApplyChangesService } from "$lib/tools/edit/applyChange";
  import { onDestroy, onMount } from "svelte";

  import * as Accordion from "$lib/components/ui/accordion";
  import BorderInput from "./inputs/BorderInput.svelte";
  import ColorInput from "./inputs/ColorInput.svelte";
  import NestedInputs from "./inputs/NestedInputs.svelte";
  import NumberUnitInput from "./inputs/NumberUnitInput.svelte";
  import SelectInput from "./inputs/SelectInput.svelte";
  import TagInfo from "./inputs/TagInfo.svelte";
  import TailwindInput from "./inputs/TailwindInput.svelte";
  import TextInput from "./inputs/TextInput.svelte";

  import type { EditTool } from "$lib/tools/edit";
  import { redoStore } from "$lib/tools/edit/history";
  import AutolayoutInput from "./inputs/AutolayoutInput.svelte";
  import DisplayInput from "./inputs/DisplayInput.svelte";

  export let editTool: EditTool;
  const applyChangeService = new ApplyChangesService();
  const custom = "Custom";
  let el: HTMLElement | undefined = undefined;

  let groupedStyles: Record<string, Record<string, ElementStyle[]>> = {};
  let appendedClass: string[] = [];
  let unsubs: (() => void)[] = [];

  onMount(() => {
    unsubs.push(
      editTool.selectorEngine.selectedStore.subscribe(selectedElementsChanged),
      // Refresh when undo redo happens
      redoStore.subscribe(() => {
        selectedElementsChanged(editTool.selectorEngine.selected);
      }),
    );
  });

  onDestroy(() => {
    unsubs.forEach((unsub) => unsub());
  });

  function selectedElementsChanged(selected: HTMLElement[]) {
    // TODO: Handle multiple elements. Show similar values and leave non-similar ones blank
    if (!selected.length) return;
    el = selected[selected.length - 1];
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

  // TODO: This could be moved into editTool along with applyChangeService
  function updateElementStyle(key, value, refresh = false) {
    editTool.selectorEngine.selected.forEach((el) => {
      applyChangeService.applyStyle(el, key, value);
    });
    // Update the rects
    editTool.updateClickedRects(editTool.selectorEngine.selected);
    editTool.updateParentRect();

    if (refresh) {
      selectedElementsChanged(editTool.selectorEngine.selected);
    }
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
    {#each Object.entries(groupedStyles) as [groupKey, subGroup]}
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
          {#each Object.entries(subGroup) as [subGroupKey, elementStyles]}
            {#if subGroupKey === ElementStyleSubGroup.Margin || subGroupKey === ElementStyleSubGroup.Padding || subGroupKey === ElementStyleSubGroup.Corners}
              <NestedInputs {elementStyles} {updateElementStyle} />
            {:else if subGroupKey === ElementStyleSubGroup.Border}
              <BorderInput {elementStyles} {updateElementStyle} />
            {:else if subGroupKey === ElementStyleSubGroup.Display}
              <DisplayInput {elementStyles} {updateElementStyle} />
            {:else}
              {#each elementStyles as elementStyle, i}
                <div class="flex flex-row items-center {i === 0 ? '' : 'mt-2'}">
                  <p class="text-xs w-24 mr-2 text-start opacity-60">
                    {elementStyle.displayName}
                  </p>
                  <div class="text-end ml-auto">
                    {#if elementStyle.type === ElementStyleType.Select}
                      <SelectInput {elementStyle} {updateElementStyle} />
                    {:else if elementStyle.type === ElementStyleType.Dimensions}
                      <AutolayoutInput
                        {el}
                        {elementStyle}
                        {updateElementStyle}
                      />
                    {:else if elementStyle.type === ElementStyleType.Color}
                      <ColorInput {elementStyle} {updateElementStyle} />
                    {:else if elementStyle.type === ElementStyleType.Number}
                      <NumberUnitInput {elementStyle} {updateElementStyle} />
                    {:else}
                      <TextInput {elementStyle} {updateElementStyle} />
                    {/if}
                  </div>
                </div>
              {/each}
            {/if}
          {/each}
        </Accordion.Content>
      </Accordion.Item>
    {/each}
    <Accordion.Item data-state="open" value={custom}>
      <Accordion.Trigger><h2 class="text-xs">{custom}</h2></Accordion.Trigger>
      <Accordion.Content>
        <TailwindInput {updateElementClass} {appendedClass} />
      </Accordion.Content>
    </Accordion.Item>
  </Accordion.Root>
{/if}
