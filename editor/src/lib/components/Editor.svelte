<script lang="ts">
  import { ToolManager, ToolName } from "$lib/tools";
  import EditorPanel from "./editor/EditorPanel.svelte";
  import LayersPanel from "./layers/LayersPanel.svelte";
  import ElementsPanel from "./elements/ElementsPanel.svelte";
  import SavePanel from "./save/SavePanel.svelte";

  let activeToolName: ToolName | undefined = ToolName.SAVE;
  let toolManager: ToolManager = new ToolManager(activeToolName);
  $: toolManager?.selectTool(activeToolName);

  export function getActiveToolName() {
    return activeToolName;
  }

  export function updateTool(toolName: ToolName) {
    activeToolName = toolName;
    toolManager?.selectTool(toolName);
  }
</script>

<EditorPanel {toolManager} />
<SavePanel {toolManager} />
<LayersPanel editTool={toolManager?.editTool} />
<ElementsPanel editTool={toolManager?.editTool} />
