<script lang="ts">
  import { draggable } from "@neodrag/svelte";
  import { tweened } from "svelte/motion";
  import { cubicOut } from "svelte/easing";
  import * as Card from "$lib/components/ui/card";
  import * as Tabs from "$lib/components/ui/tabs";
  import CssTab from "./CssTab.svelte";
  import { Separator } from "$lib/components/ui/separator";
  import { editorPanelVisible } from "$lib/states/editor";
  import type { EditTool } from "$lib/tools/edit";
  // import Changes from "./Changes.svelte";
  import CodeTab from "./CodeTab.svelte";

  export let editTool: EditTool;
  enum TabValue {
    CSS = "css",
    CODE = "code",
    CHANGES = "changes",
  }
  let selectedTab: string = TabValue.CSS;

  // Whenever selectedTab changes, update numericWidth and the tweened width
  const codeWidth = 400;
  const cssWidth = 232;
  let numericWidth = selectedTab === TabValue.CODE ? codeWidth : cssWidth;
  const width = tweened(numericWidth, {
    duration: 400,
    easing: cubicOut,
  });
  $: (numericWidth = selectedTab === TabValue.CODE ? codeWidth : cssWidth),
    width.set(numericWidth);
</script>

<div
  use:draggable={{ bounds: "body" }}
  class="fixed top-10 right-2 transform -translate-y-1/2 -translate-x-1/2 {$editorPanelVisible
    ? 'visible'
    : 'invisible'}"
>
  <Card.Root
    class="h-[80vh] w-[{$width}px] backdrop-blur bg-background/90 pt-2"
  >
    <Card.Content>
      <Tabs.Root bind:value={selectedTab} class="w-full h-full">
        <Tabs.List class="bg-transparent p-0 gap-4">
          <Tabs.Trigger class="bg-transparent p-0 text-xs" value={TabValue.CSS}
            >Appearance</Tabs.Trigger
          >
          <Tabs.Trigger class="bg-transparent p-0 text-xs" value={TabValue.CODE}
            >Code</Tabs.Trigger
          >
          <!-- <Tabs.Trigger class="bg-transparent p-0 text-xs" value={TabValue.OTHER}>Changes</Tabs.Trigger> -->
        </Tabs.List>
        <Separator class="mt-1" />
        <div
          class="h-[calc(80vh-4rem)] overflow-auto overflow-y-hidden hover:overflow-y-auto"
        >
          <Tabs.Content value={TabValue.CSS}><CssTab {editTool} /></Tabs.Content
          >
          <Tabs.Content value={TabValue.CODE}
            ><CodeTab {editTool} /></Tabs.Content
          >
          <!-- <Tabs.Content value={TabValue.CHANGES}><Changes /></Tabs.Content> -->
        </div>

        <Card.Footer class="flex justify-between"></Card.Footer>
      </Tabs.Root>
    </Card.Content>
  </Card.Root>
</div>
