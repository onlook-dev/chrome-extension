<script lang="ts">
  import "./app.pcss";
  import Toolbar from "./lib/components/toolbar/Toolbar.svelte";

  import { ToolName } from "$lib/tools";
  import { historyStore } from "$lib/tools/edit/history";
  import { ONLOOK_TOOLBAR } from "$shared/constants";
  import {
    DATA_ONLOOK_EJECT,
    DATA_ONLOOK_HOVER,
    DATA_ONLOOK_INJECT,
    DATA_ONLOOK_SAVED,
  } from "$lib/constants";
  import { savingProject } from "$lib/states/editor";

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
    } else if (name === DATA_ONLOOK_SAVED && newValue === "true") {
      savingProject.set(false);
    }
  }
</script>

<div id={ONLOOK_TOOLBAR}>
  <Toolbar bind:this={toolbarRef} />
</div>
