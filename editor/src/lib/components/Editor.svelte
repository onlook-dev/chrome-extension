<script lang="ts">
  import { ToolManager, ToolName } from "$lib/tools";
  import EditorPanel from "./editor/EditorPanel.svelte";
  import LayersPanel from "./layers/LayersPanel.svelte";
  import ElementsPanel from "./elements/ElementsPanel.svelte";
  import PublishPanel from "./publish/PublishPanel.svelte";

  let toolManager: ToolManager = new ToolManager();

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
