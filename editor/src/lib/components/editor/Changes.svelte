<script lang="ts">
  import { historyStore } from "$lib/tools/edit/history";
  import { prepareChanges } from "$lib/tools/translate/translateHelper";
  import { get } from "svelte/store";

  function handlePrepareChanges() {
    const history = get(historyStore); // Directly get the current value of historyStore
    const changes = prepareChanges(history);
    console.log("changes:", JSON.stringify(changes, null, 2));
  }
</script>

<div>
  <h2>Changes</h2>
  <button on:click={handlePrepareChanges}>Prepare Changes</button>
</div>
