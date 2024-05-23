<script lang="ts">
  import * as Card from "$lib/components/ui/card";
  import { elementsPanelVisible } from "$lib/states/editor";
  import { draggable } from "$lib/utils";
  import ElementsTab from "./ElementsTab.svelte";
  import type { EditTool } from "$lib/tools/edit";

  export let editTool: EditTool;
  let isInputFocused = false;
</script>

<div
  use:draggable
  on:focusin={() => (isInputFocused = true)}
  on:focusout={() => (isInputFocused = false)}
  class="fixed top-10 left-[calc(260px+20px)] {$elementsPanelVisible
    ? 'visible'
    : 'invisible'}"
>
  <Card.Root
    data-drag-handle
    class="w-[340px] h-[60vh] backdrop-blur bg-background/90 pt-2"
  >
    <Card.Content>
      <ElementsTab {editTool} />
    </Card.Content>
  </Card.Root>
</div>
