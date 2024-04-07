<script lang="ts">
  import { type EditEvent, EditType } from "$shared/models/editor";
  import { historyStore, undoEvent } from "$lib/tools/edit/history";
  // import * as Avatar from "$lib/components/ui/avatar";
  import type { EditTool } from "$lib/tools/edit";
  import { slide } from "svelte/transition";
  import { jsToCssProperty, timeSince } from "$shared/helpers";
  import { Trash } from "radix-icons-svelte";

  export let editTool: EditTool;
  let hoveredEvent: EditEvent | undefined;
  let clickedEvent: EditEvent | undefined;
  let selfSelected = false;

  $: events = [...$historyStore].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  editTool.selectorEngine.selectedStore.subscribe((selected) => {
    if (!selfSelected) {
      clickedEvent = undefined;
    }
    selfSelected = false;
  });

  function shortenSelector(selector: string) {
    return selector.split(" ").pop();
  }

  function hoverEvent(event: EditEvent) {
    hoveredEvent = event;
    const el: HTMLElement | undefined = document.querySelector(event.selector);
    if (!el) {
      editTool.simulateOut();
      return;
    } else {
      editTool.simulateHover(el);
    }
  }

  function clickEvent(event: EditEvent) {
    if (event && clickedEvent === event) {
      clickedEvent = undefined;
      editTool.simulateClick([]);
      return;
    }

    clickedEvent = event;
    const el: HTMLElement | undefined = document.querySelector(event.selector);
    if (!el) return;
    selfSelected = true;
    editTool.simulateClick([el]);
  }

  function deleteEvent(event: EditEvent) {
    if (!event) return;
    undoEvent(event);
  }
</script>

<div class="text-xs flex flex-col space-y-2">
  {#if events.length === 0}
    <div
      class="flex flex-col items-center justify-center text-center h-full pt-6"
      transition:slide
    >
      <p class="opacity-60">Start editing to see changes</p>
    </div>
  {/if}
  {#each events as event}
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div
      class="rounded flex flex-col space-y-2 p-2 mb-1 transition duration-200 ease-in-out cursor-pointer {hoveredEvent ==
      event
        ? 'bg-red/20'
        : ''} {clickedEvent == event
        ? 'bg-red/20 border border-red p-[calc(0.5rem-1px)]'
        : ''}"
      transition:slide
      on:mouseenter={() => {
        hoverEvent(event);
      }}
      on:mouseleave={(e) => {
        hoveredEvent = undefined;
        editTool.simulateOut();
      }}
      on:click={() => {
        clickEvent(event);
      }}
    >
      <div class="flex flex-row items-center w-full">
        <!-- <Avatar.Root class="h-6 w-6">
          <Avatar.Image />
          <Avatar.Fallback></Avatar.Fallback>
        </Avatar.Root> -->
        <p>You</p>
        <p class="ml-2 text-white/60">{timeSince(new Date(event.createdAt))}</p>
        <button
          class="ml-auto transition hover:text-white/80 text-white/60"
          on:click={() => deleteEvent(event)}><Trash /></button
        >
      </div>
      <div class="flex flex-row items-center space-x-1">
        <p class="opacity-60">Element:</p>
        <span class="text-red bg-red/20 p-1"
          >{event.componentId ?? shortenSelector(event.selector)}</span
        >
      </div>
      <ul
        class="p-2 rounded transition duration-200 ease-in-out {hoveredEvent ==
          event || clickedEvent == event
          ? 'bg-red/20'
          : 'bg-stone-900'}"
        transition:slide
      >
        {#if event.editType === EditType.INSERT}
          <li class="opacity-60">
            Inserted: {event.newVal["componentId"]?.split("-")[0] || "Element"}
          </li>
          <li class="opacity-60">
            Position: {event.newVal["position"] || "0"}
          </li>
          <li class="opacity-60">
            Id: {event.newVal["componentId"]}
          </li>
        {:else if event.editType === EditType.REMOVE}
          <li class="opacity-60">
            Removed: {event.oldVal["componentId"]?.split("-")[0] || "Element"}
          </li>
          <li class="opacity-60">
            Position: {event.oldVal["position"] || "0"}
          </li>
          <li class="opacity-60">
            Id: {event.oldVal["componentId"]}
          </li>
        {:else if event.editType === EditType.CLASS}
          {#each Object.entries(event.newVal) as [key, val]}
            <li class="opacity-60">{key}: {val};</li>
          {/each}
        {:else}
          {#each Object.entries(event.newVal) as [key, val]}
            <li class="opacity-60">{jsToCssProperty(key)}: {val};</li>
          {/each}
        {/if}
      </ul>
    </div>
  {/each}
</div>
