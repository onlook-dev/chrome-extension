<script lang="ts">
  import { elementsPanelVisible } from "$lib/states/editor";
  import type { EditTool } from "$lib/tools/edit";
  import { ElementsManager } from "$lib/tools/elements";
  import { CustomElementType } from "$lib/tools/elements/custom";
  import {
    Plus,
    Text,
    Button,
    Image,
    Square,
    ViewVertical,
    ViewHorizontal,
    Grid,
    MagnifyingGlass,
    Input,
  } from "radix-icons-svelte";
  import { slide } from "svelte/transition";

  export let editTool: EditTool;
  let elementManager: ElementsManager = new ElementsManager();
  let hovered: CustomElementType | undefined;
  let filterValue: string = "";

  $: defaultElements = elementManager.getFilteredDefaultElements(filterValue);
</script>

<div class="flex flex-col text-xs space-y-2 pt-1">
  <div class="flex flex-row py-2">
    <p>Insert Element</p>
    <button
      class="ml-auto text-red hover:text-red/90 transition"
      on:click={() => {
        elementsPanelVisible.set(false);
      }}>Cancel</button
    >
  </div>
  <label
    class="flex flex-row items-center text-text bg-stone-900 rounded p-2 space-x-2 my-1"
  >
    <MagnifyingGlass class="pointer-events-none w-4 h-4 opacity-60" />
    <input
      bind:value={filterValue}
      type="text"
      placeholder="Search for an element"
      class="form-input bg-transparent border-none appearance-none flex-grow focus:outline-none"
    />
  </label>
  <div class="overflow-auto h-[calc(60vh-7rem)]">
    {#if Object.keys(defaultElements).length === 0}
      <p class="mt-4 text-center opacity-60" transition:slide>
        We don’t have that element yet, try something else
      </p>
    {/if}

    {#each Object.entries(defaultElements) as [key, elements]}
      <p class="opacity-30 my-1" transition:slide>{key}</p>
      <div transition:slide>
        {#each elements as element}
          <!-- svelte-ignore a11y-no-static-element-interactions -->
          <!-- svelte-ignore a11y-click-events-have-key-events -->
          <div
            class="flex flex-row p-1 rounded items-center space-x-2 cursor-pointer transition {hovered ==
            element.type
              ? 'bg-red/20'
              : ''}"
            transition:slide
            on:mouseenter={() => (hovered = element.type)}
            on:mouseleave={() => (hovered = undefined)}
            on:click={() => {
              editTool.insertElement(element.getElement());
              elementsPanelVisible.set(false);
            }}
          >
            <div
              class="w-8 h-8 rounded flex items-center justify-center transition {hovered ==
              element.type
                ? 'bg-red/20 text-red'
                : 'bg-stone-800'}"
            >
              {#if element.type === CustomElementType.Text}
                <Text class="w-4 h-4" />
              {:else if element.type === CustomElementType.Button}
                <Button class="w-4 h-4" />
              {:else if element.type === CustomElementType.Image}
                <Image class="w-4 h-4" />
              {:else if element.type === CustomElementType.Div}
                <Square class="w-4 h-4" />
              {:else if element.type === CustomElementType.RowDiv}
                <ViewVertical class="w-4 h-4" />
              {:else if element.type === CustomElementType.ColumnDiv}
                <ViewHorizontal class="w-4 h-4" />
              {:else if element.type === CustomElementType.GridDiv}
                <Grid class="w-4 h-4" />
              {:else if element.type === CustomElementType.Input}
                <Input class="w-4 h-4" />
              {/if}
            </div>
            <div class="flex flex-col flex-grow">
              <p class="transition {hovered == element.type ? 'text-red' : ''}">
                {element.title}
              </p>
              {#if element.subtitle}
                <p
                  class="opacity-60 transition {hovered == element.type
                    ? 'text-red'
                    : ''}"
                >
                  {element.subtitle}
                </p>
              {/if}
            </div>
            {#if hovered == element.type}
              <div>
                <Plus class="w-4 h-4 text-red" />
              </div>
            {/if}
          </div>
        {/each}
      </div>
    {/each}
  </div>
</div>
