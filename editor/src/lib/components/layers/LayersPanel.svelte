<script lang="ts">
  import { onMount } from "svelte";
  import { historyStore } from "$lib/tools/edit/history";
  import { slide } from "svelte/transition";
  import { draggable } from "@neodrag/svelte";
  import { editorPanelVisible, layersPanelCollapsed } from "$lib/states/editor";
  import { DragHandleDots2, LineHeight, Minus, Size } from "radix-icons-svelte";

  import LayersTab from "./LayersTab.svelte";
  import ChangesTab from "./ChangesTab.svelte";
  import Separator from "../ui/separator/separator.svelte";
  import * as Card from "$lib/components/ui/card";
  import * as Tabs from "$lib/components/ui/tabs";

  import type { EditTool } from "$lib/tools/edit";

  enum TabValue {
    LAYERS = "css",
    CHANGES = "changes",
    ELEMENTS = "elements",
  }
  export let editTool: EditTool;
  let selectedTab = TabValue.LAYERS;
  let panelCollapsed = $layersPanelCollapsed;
  let newHistory: boolean = false;
  let isInputFocused = false;
  let cardRef: HTMLDivElement;
  let cardHeight = "60vh";
  const cardWidth = "260px";

  historyStore.subscribe((history) => {
    if (selectedTab === TabValue.CHANGES) return;
    newHistory = history.length > 0;
  });

  $: if (selectedTab === TabValue.CHANGES) {
    newHistory = false;
  }

  onMount(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        cardHeight = `${entry.contentRect.height}px`;
      }
    });

    resizeObserver.observe(cardRef);
  });

  function collapsePanel() {
    panelCollapsed = !panelCollapsed;
    layersPanelCollapsed.set(panelCollapsed);
  }
</script>

<div
  use:draggable={{
    bounds: {
      top: 0,
      left: 0,
    },
    handle: ".handle",
    disabled: isInputFocused,
  }}
  on:focusin={() => (isInputFocused = true)}
  on:focusout={() => (isInputFocused = false)}
  class="fixed top-10 left-2 {$editorPanelVisible ? 'visible' : 'invisible'}"
>
  <div
    bind:this={cardRef}
    class="{panelCollapsed
      ? 'h-[3rem]'
      : 'resize h-[60vh]'} min-h-[3rem] w-[{cardWidth}] min-w-[{cardWidth}] overflow-hidden bg-transparent"
    style={panelCollapsed
      ? "transition: height 0.4s cubic-bezier(0.215, 0.61, 0.355, 1);"
      : ""}
  >
    <Card.Root class="h-full backdrop-blur bg-background/90 pt-2">
      <Card.Content>
        <Tabs.Root bind:value={selectedTab} class="w-full h-full">
          <Tabs.List class="handle bg-transparent p-0 gap-4 w-full select-none	">
            <Tabs.Trigger
              class="bg-transparent p-0 text-xs"
              value={TabValue.LAYERS}>Layers</Tabs.Trigger
            >

            <Tabs.Trigger
              class="bg-transparent p-0 text-xs space-x-2 {newHistory
                ? 'text-red'
                : ''}"
              value={TabValue.CHANGES}
              >{#if newHistory}
                <p transition:slide={{ axis: "x" }} class="text-lg mr-2">
                  •
                </p>{/if}
              Changes
            </Tabs.Trigger>
            <div class="ml-auto flex items-center">
              <div
                class="w-8 h-8 flex items-center justify-center cursor-pointer transition hover:text-white/80"
              >
                <DragHandleDots2 class="w-4 h-4 pointer-events-none" />
              </div>
              <button
                class="w-8 h-8 flex items-center justify-center transition hover:text-white/80"
                on:click={collapsePanel}
              >
                {#if panelCollapsed}
                  <Size class="w-4 h-4" />
                {:else}
                  <Minus class="w-4 h-4" />
                {/if}
              </button>
            </div>
          </Tabs.List>
          <Separator class="mt-1" />
          <div
            class="h-[calc({cardHeight}-4rem)] overscroll-contain overflow-auto"
          >
            <Tabs.Content value={TabValue.LAYERS}
              ><LayersTab {editTool} />
            </Tabs.Content>
            <Tabs.Content value={TabValue.CHANGES}
              ><ChangesTab {editTool} /></Tabs.Content
            >
          </div>
        </Tabs.Root>
      </Card.Content>
    </Card.Root>
  </div>
</div>
