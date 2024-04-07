<script lang="ts">
  import { historyStore } from "$lib/tools/edit/history";
  import { slide } from "svelte/transition";
  import { draggable } from "@neodrag/svelte";
  import { editorPanelVisible, layersPanelCollapsed } from "$lib/states/editor";
  import { DragHandleDots2, LineHeight } from "radix-icons-svelte";

  import LayersTab from "./LayersTab.svelte";
  import ChangesTab from "./ChangesTab.svelte";
  import Separator from "../ui/separator/separator.svelte";
  import * as Card from "$lib/components/ui/card";
  import * as Tabs from "$lib/components/ui/tabs";

  import type { EditTool } from "$lib/tools/edit";

  export let editTool: EditTool;
  let newHistory: boolean = false;
  let isInputFocused = false;

  enum TabValue {
    LAYERS = "css",
    CHANGES = "changes",
    ELEMENTS = "elements",
  }
  let selectedTab = TabValue.LAYERS;
  let panelCollapsed = $layersPanelCollapsed;

  historyStore.subscribe((history) => {
    if (selectedTab === TabValue.CHANGES) return;
    newHistory = history.length > 0;
  });

  $: if (selectedTab === TabValue.CHANGES) {
    newHistory = false;
  }

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
  <Card.Root
    class="transition {panelCollapsed
      ? 'h-[3rem]'
      : 'h-[60vh]'} w-[260px] backdrop-blur bg-background/90 pt-2 overflow-hidden"
    style="transition: height 0.4s cubic-bezier(0.215, 0.61, 0.355, 1);"
  >
    <Card.Content>
      <Tabs.Root bind:value={selectedTab} class="w-full h-full">
        <Tabs.List class="handle bg-transparent p-0 gap-4 w-full">
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
            <button
              class="w-8 h-8 flex items-center justify-center transition hover:text-white/80"
              on:click={collapsePanel}
            >
              <LineHeight />
            </button>
            <div
              class="w-8 h-8 flex items-center justify-center cursor-pointer transition hover:text-white/80"
            >
              <DragHandleDots2 />
            </div>
          </div>
        </Tabs.List>
        <Separator class="mt-1" />
        <div class="h-[calc(60vh-4rem)] overscroll-contain overflow-auto">
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
