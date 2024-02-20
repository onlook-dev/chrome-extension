<script lang="ts">
  import { draggable } from "@neodrag/svelte";
  import * as Card from "$lib/components/ui/card";
  import * as Tabs from "$lib/components/ui/tabs";
  import { Separator } from "$lib/components/ui/separator";
  import { editorPanelVisible, layersPanelVisible } from "$lib/states/editor";
  import type { EditTool } from "$lib/tools/edit";
  import LayersTab from "./LayersTab.svelte";

  export let editTool: EditTool;

  enum TabValue {
    LAYERS = "css",
    OTHER = "other",
  }
</script>

<div
  use:draggable={{ bounds: "body" }}
  class="fixed top-10 left-2 transform -translate-y-1/2 -translate-x-1/2 {$editorPanelVisible
    ? 'visible'
    : 'invisible'}"
>
  <Card.Root class="w-[260px] h-[60vh] opacity-[98%] pt-2">
    <Card.Content>
      <Tabs.Root value={TabValue.LAYERS} class="w-full h-full">
        <Tabs.List class="bg-transparent p-0 gap-4">
          <Tabs.Trigger
            class="bg-transparent p-0 text-xs"
            value={TabValue.LAYERS}>Layers</Tabs.Trigger
          >
        </Tabs.List>
        <Separator class="mt-1" />
        <div class="h-[53vh] overflow-auto">
          <Tabs.Content value={TabValue.LAYERS}
            ><LayersTab {editTool} /></Tabs.Content
          >
        </div>
        <Card.Footer class="flex justify-between"></Card.Footer>
      </Tabs.Root>
    </Card.Content>
  </Card.Root>
</div>
