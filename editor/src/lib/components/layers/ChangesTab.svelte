<script lang="ts">
  import type { EditEvent } from "$lib/types/editor";
  import { historyStore } from "$lib/tools/edit/history";
  import * as Avatar from "$lib/components/ui/avatar";
  import type { EditTool } from "$lib/tools/edit";
  import { slide } from "svelte/transition";
  import Separator from "../ui/separator/separator.svelte";

  export let editTool: EditTool;
  let hoveredEvent: EditEvent | undefined;
  let clickedEvent: EditEvent | undefined;

  $: events = [...$historyStore].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  function shortenSelector(selector: string) {
    return selector.split(" ").pop();
  }

  // TODO: Use from shared.
  function jsToCssProperty(key: string) {
    if (!key) return "";
    return key.replace(/([A-Z])/g, "-$1").toLowerCase();
  }

  export function timeSince(date: Date) {
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      console.error("Invalid date provided");
      return "Invalid date";
    }

    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    let interval = seconds / 31536000;

    if (interval > 1) {
      return Math.floor(interval) + "y";
    }
    interval = seconds / 2592000;
    if (interval > 1) {
      return Math.floor(interval) + "m";
    }
    interval = seconds / 86400;
    if (interval > 1) {
      return Math.floor(interval) + "d";
    }
    interval = seconds / 3600;
    if (interval > 1) {
      return Math.floor(interval) + "h";
    }
    interval = seconds / 60;
    if (interval > 1) {
      return Math.floor(interval) + "m";
    }
    return Math.floor(seconds) + "s";
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

    editTool.simulateClick([el]);
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
      class="rounded flex flex-col space-y-2 p-2 mb-1 transition duration-300 ease-in-out cursor-pointer {hoveredEvent ==
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
      <div class="flex flex-row items-center space-x-2">
        <Avatar.Root class="h-6 w-6">
          <Avatar.Image />
          <Avatar.Fallback></Avatar.Fallback>
        </Avatar.Root>
        <p>You</p>
        <p class="opacity-60">{timeSince(new Date(event.createdAt))}</p>
      </div>
      <div class="flex flex-row items-center space-x-1">
        <p class="opacity-60">Element:</p>
        <span class="text-red bg-red/20 p-1"
          >{shortenSelector(event.selector)}</span
        >
      </div>
      <ul
        class="p-2 rounded {hoveredEvent == event || clickedEvent == event
          ? 'bg-red/20'
          : 'bg-stone-900'}"
        transition:slide
      >
        {#each Object.entries(event.newVal) as [key, val]}
          <li class="opacity-60">{jsToCssProperty(key)}: {val};</li>
        {/each}
      </ul>
    </div>
    <Separator />
  {/each}
</div>
