<script lang="ts">
  import { draggable } from "@neodrag/svelte";
  import * as Card from "$lib/components/ui/card";
  import * as Tabs from "$lib/components/ui/tabs";
  import { Separator } from "$lib/components/ui/separator";
  import { editorPanelVisible } from "$lib/states/editor";
  import type { EditTool } from "$lib/tools/edit";
  import LayersTab from "./LayersTab.svelte";
  import ChangesTab from "./ChangesTab.svelte";
  import { historyStore } from "$lib/tools/edit/history";
  import { slide } from "svelte/transition";

  enum TabValue {
    LAYERS = "css",
    CHANGES = "changes",
  }

  export let editTool: EditTool;
  let newHistory: boolean = false;
  let selectedTab = TabValue.LAYERS;

  historyStore.subscribe((history) => {
    if (selectedTab === TabValue.CHANGES) return;
    newHistory = history.length > 0;
  });

  $: if (selectedTab === TabValue.CHANGES) {
    newHistory = false;
  }
</script>

<div
  use:draggable={{ bounds: "body" }}
  class="fixed top-10 left-2 transform -translate-y-1/2 -translate-x-1/2 {$editorPanelVisible
    ? 'visible'
    : 'invisible'}"
>
  <Card.Root class="w-[260px] h-[60vh] backdrop-blur bg-background/90 pt-2">
    <Card.Content>
      <Tabs.Root bind:value={selectedTab} class="w-full h-full">
        <Tabs.List class="bg-transparent p-0 gap-4">
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
        </Tabs.List>
        <Separator class="mt-1" />
        <div class="h-[calc(60vh-4rem)] overflow-auto">
          <Tabs.Content value={TabValue.LAYERS}
            ><LayersTab {editTool} /></Tabs.Content
          >
          <Tabs.Content value={TabValue.CHANGES}
            ><ChangesTab {editTool} /></Tabs.Content
          >
        </div>
        <Card.Footer class="flex justify-between"></Card.Footer>
      </Tabs.Root>
    </Card.Content>
  </Card.Root>
</div>
