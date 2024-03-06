<script lang="ts">
  import { ToolName } from "$lib/tools";
  import { historyStore } from "$lib/tools/edit/history";
  import "./app.pcss";
  import Toolbar from "./lib/components/toolbar/Toolbar.svelte";
  import {
    DATA_ONLOOK_EJECT,
    DATA_ONLOOK_INJECT,
    ONLOOK_TOOLBAR,
  } from "./lib/constants";

  let toolbarRef: Toolbar;
  let previousTool: ToolName | undefined = ToolName.EDIT;

  window.addEventListener("beforeunload", function (e) {
    // If changes in page, prompt user before reload
    if ($historyStore.length > 0) {
      e.preventDefault();
      e.returnValue = "";
    }
  });

  export function handleValueUpdate(name, oldValue, newValue) {
    if (name === DATA_ONLOOK_EJECT && newValue === "true") {
      previousTool = toolbarRef.getActiveToolName();
      toolbarRef.updateTool(undefined);
    } else if (name === DATA_ONLOOK_INJECT && newValue === "true") {
      toolbarRef.updateTool(previousTool);
    }
  }
</script>

<div id={ONLOOK_TOOLBAR}>
  <Toolbar bind:this={toolbarRef} />
</div>
