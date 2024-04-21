<script lang="ts">
  import { onMount } from "svelte";
  import { draggable } from "@neodrag/svelte";
  import { Separator } from "$lib/components/ui/separator";
  import { editorPanelVisible } from "$lib/states/editor";
  import { DragHandleDots2, LineHeight } from "radix-icons-svelte";

  import type { EditTool } from "$lib/tools/edit";

  import * as Card from "$lib/components/ui/card";
  import * as Tabs from "$lib/components/ui/tabs";
  import CssTab from "./CssTab.svelte";

  enum TabValue {
    CSS = "css",
    CODE = "code",
  }

  export let editTool: EditTool;
  let selectedTab: string = TabValue.CSS;
  let isInputFocused = false;
  let panelCollapsed = false;
  let cardRef: HTMLDivElement;
  const cardWidth = "232px";
  let cardHeight = "80vh";

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
  class="fixed top-10 right-2 overscroll-contain {$editorPanelVisible
    ? 'visible'
    : 'invisible'}"
>
  <div
    bind:this={cardRef}
    class="{panelCollapsed
      ? 'h-[3rem]'
      : 'resize-y h-[80vh]'} w-[{cardWidth}] min-h-[3rem] overflow-hidden bg-transparent"
    style={panelCollapsed
      ? "transition: height 0.4s cubic-bezier(0.215, 0.61, 0.355, 1);"
      : ""}
  >
    <Card.Root class="backdrop-blur h-full bg-background/90 pt-2">
      <Card.Content>
        <Tabs.Root bind:value={selectedTab} class="w-full h-full">
          <Tabs.List class="handle bg-transparent p-0 gap-4 w-full select-none	">
            <Tabs.Trigger
              class="bg-transparent p-0 text-xs"
              value={TabValue.CSS}>Element Appearance</Tabs.Trigger
            >
            <div class="ml-auto flex items-center">
              <button
                class="w-8 h-8 flex items-center justify-center transition hover:text-white/80"
                on:click={collapsePanel}
              >
                <LineHeight class="w-4 h-4" />
              </button>
              <div
                class="w-8 h-8 flex items-center justify-center cursor-pointer transition hover:text-white/80"
              >
                <DragHandleDots2 class="w-4 h-4 pointer-events-none	" />
              </div>
            </div>
          </Tabs.List>
          <Separator class="mt-1" />
          <div
            class="h-[calc({cardHeight}-4rem)] overscroll-contain overflow-auto"
          >
            <Tabs.Content value={TabValue.CSS}
              ><CssTab {editTool} /></Tabs.Content
            >
          </div>
          <Card.Footer class="flex justify-between"></Card.Footer>
        </Tabs.Root>
      </Card.Content>
    </Card.Root>
  </div>
</div>
