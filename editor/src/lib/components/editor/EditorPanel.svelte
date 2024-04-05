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
  import { DragHandleDots2, LineHeight } from "radix-icons-svelte";

  // import CodeTab from "./CodeTab.svelte";

  export let editTool: EditTool;
  let isInputFocused = false;

  enum TabValue {
    CSS = "css",
    CODE = "code",
    COMPONENTS = "components",
  }
  let selectedTab: string = TabValue.CSS;
  let panelCollapsed = false;
  const codeWidth = 400;
  const cssWidth = 232;
  let numericWidth = selectedTab === TabValue.CODE ? codeWidth : cssWidth;

  const width = tweened(numericWidth, {
    duration: 400,
    easing: cubicOut,
  });
  $: (numericWidth = selectedTab === TabValue.CODE ? codeWidth : cssWidth),
    width.set(numericWidth);

  function collapsePanel() {
    panelCollapsed = !panelCollapsed;
  }
</script>

<div
  use:draggable={{
    bounds: {
      top: 0,
      left: 0,
    },
    disabled: isInputFocused,
    handle: ".handle",
  }}
  on:focusin={() => (isInputFocused = true)}
  on:focusout={() => (isInputFocused = false)}
  class="fixed top-10 right-2 {$editorPanelVisible ? 'visible' : 'invisible'}"
>
  <Card.Root
    class="transition {panelCollapsed
      ? 'h-[3rem]'
      : 'h-[80vh]'} w-[{$width}px] backdrop-blur bg-background/90 pt-2 overflow-hidden"
    style="transition: height 0.4s cubic-bezier(0.215, 0.61, 0.355, 1);"
  >
    <Card.Content>
      <Tabs.Root bind:value={selectedTab} class="w-full h-full">
        <Tabs.List class="bg-transparent p-0 gap-4 w-full">
          <Tabs.Trigger class="bg-transparent p-0 text-xs" value={TabValue.CSS}
            >Appearance</Tabs.Trigger
          >
          <!-- <Tabs.Trigger class="bg-transparent p-0 text-xs" value={TabValue.CODE}
            >Code</Tabs.Trigger
          > -->
          <div class="ml-auto flex items-center">
            <button
              class="w-6 h-6 flex items-center justify-center transition hover:text-white/80"
              on:click={collapsePanel}
            >
              <LineHeight />
            </button>
            <div
              class="handle w-6 h-6 flex items-center justify-center cursor-pointer transition hover:text-white/80"
            >
              <DragHandleDots2 />
            </div>
          </div>
        </Tabs.List>
        <Separator class="mt-1" />
        <div class="h-[calc(80vh-4rem)]">
          <Tabs.Content value={TabValue.CSS}><CssTab {editTool} /></Tabs.Content
          >
          <!-- <Tabs.Content value={TabValue.CODE}
            ><CodeTab {editTool} /></Tabs.Content
          > -->
        </div>
        <Card.Footer class="flex justify-between"></Card.Footer>
      </Tabs.Root>
    </Card.Content>
  </Card.Root>
</div>
