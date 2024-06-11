<script lang="ts">
  import { ToolManager, ToolName } from "$lib/tools";
  import { EventListenerService } from "./listener";
  import { onMount } from "svelte";
  import { setNamespace } from "webext-bridge/window";
  import { MESSAGING_NAMESPACE } from "$shared/message";

  import EditorPanel from "./editor/EditorPanel.svelte";
  import LayersPanel from "./layers/LayersPanel.svelte";
  import ElementsPanel from "./elements/ElementsPanel.svelte";
  import PublishPanel from "./publish/PublishPanel.svelte";

  const toolManager: ToolManager = new ToolManager();
  const eventListener: EventListenerService = new EventListenerService();

  onMount(() => {
    // Listen for general events
    eventListener.listen();
    setNamespace(MESSAGING_NAMESPACE);
  });

  export function getActiveToolName(): ToolName {
    return toolManager.selectedToolName;
  }

  export function updateTool(toolName: ToolName) {
    toolManager?.selectTool(toolName);
  }
</script>

<EditorPanel {toolManager} />
<PublishPanel {toolManager} />
<LayersPanel editTool={toolManager?.editTool} />
<ElementsPanel editTool={toolManager?.editTool} />
