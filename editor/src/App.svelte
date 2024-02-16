<script lang="ts">
  import "./app.pcss";
  import "./inter.css";
  import Toolbar from "./lib/components/toolbar/Toolbar.svelte";
  import { ONLOOK_TOOLBAR } from "./lib/constants";
</script>

<div id={ONLOOK_TOOLBAR}>
  <Toolbar />
</div>
