<script lang="ts">
  import { draggable } from "@neodrag/svelte";
  import * as Card from "$lib/components/ui/card";
  import * as Tabs from "$lib/components/ui/tabs";
  import CssTab from "./CssTab.svelte";
  import { Separator } from "$lib/components/ui/separator";
  import { editorPanelVisible } from "$lib/states/editor";
  import type { EditTool } from "$lib/tools/edit";

  export let editTool: EditTool;

  enum TabValue {
    CSS = "css",
    OTHER = "other",
  }
</script>

<div
  use:draggable={{ bounds: "body" }}
  class="fixed top-10 right-2 transform -translate-y-1/2 -translate-x-1/2 {$editorPanelVisible
    ? 'visible'
    : 'invisible'}"
>
  <Card.Root class="w-[232px] h-[80vh] backdrop-blur bg-background/90 pt-2">
    <Card.Content>
      <Tabs.Root value={TabValue.CSS} class="w-full h-full">
        <Tabs.List class="bg-transparent p-0 gap-4">
          <Tabs.Trigger class="bg-transparent p-0 text-xs" value={TabValue.CSS}
            >Element Appearance</Tabs.Trigger
          >
        </Tabs.List>
        <Separator class="mt-1" />
        <div
          class="h-[calc(80vh-4rem)] overflow-auto overflow-y-hidden hover:overflow-y-auto"
        >
          <Tabs.Content value={TabValue.CSS}><CssTab {editTool} /></Tabs.Content
          >
          <Tabs.Content value={TabValue.OTHER}>Others</Tabs.Content>
        </div>

        <Card.Footer class="flex justify-between"></Card.Footer>
      </Tabs.Root>
    </Card.Content>
  </Card.Root>
</div>
