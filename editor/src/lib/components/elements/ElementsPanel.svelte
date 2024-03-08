<script lang="ts">
  import { draggable } from "@neodrag/svelte";
  import * as Card from "$lib/components/ui/card";
  import { elementsPanelVisible } from "$lib/states/editor";
  import ElementsTab from "./ElementsTab.svelte";
  import type { EditTool } from "$lib/tools/edit";

  export let editTool: EditTool;
</script>

<div
  use:draggable={{
    bounds: {
      top: 0,
      left: 0,
    },
  }}
  class="fixed top-10 left-[calc(260px+20px)] {$elementsPanelVisible
    ? 'visible'
    : 'invisible'}"
>
  <Card.Root class="w-[320px] h-[60vh] backdrop-blur bg-background/90 pt-2">
    <Card.Content>
      <ElementsTab {editTool} />
    </Card.Content>
  </Card.Root>
</div>
