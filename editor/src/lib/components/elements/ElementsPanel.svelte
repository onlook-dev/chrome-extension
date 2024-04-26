<script lang="ts">
  import { draggable } from "@neodrag/svelte";
  import * as Card from "$lib/components/ui/card";
  import { elementsPanelVisible } from "$lib/states/editor";
  import ElementsTab from "./ElementsTab.svelte";
  import type { EditTool } from "$lib/tools/edit";
  import { onMount } from "svelte";

  export let editTool: EditTool;
  let isInputFocused = false;
</script>

<div
  use:draggable={{
    bounds: {
      top: 0,
      left: 0,
    },
    disabled: isInputFocused,
  }}
  on:focusin={() => (isInputFocused = true)}
  on:focusout={() => (isInputFocused = false)}
  class="fixed top-10 left-[calc(260px+20px)] {$elementsPanelVisible
    ? 'visible'
    : 'invisible'}"
>
  <Card.Root class="w-[340px] h-[60vh] backdrop-blur bg-background/90 pt-2">
    <Card.Content>
      <ElementsTab {editTool} />
    </Card.Content>
  </Card.Root>
</div>
