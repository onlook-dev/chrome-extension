<script lang="ts">
  import { historyStore } from "$lib/tools/edit/history";
  import "./app.pcss";
  import Toolbar from "./lib/components/toolbar/Toolbar.svelte";
  import { ONLOOK_TOOLBAR } from "./lib/constants";

  window.addEventListener("beforeunload", function (e) {
    // If changes in page, prompt user before reload
    if ($historyStore.length > 0) {
      e.preventDefault();
      e.returnValue = "";
    }
  });
</script>

<div id={ONLOOK_TOOLBAR}>
  <Toolbar />
</div>
