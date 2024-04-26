<script lang="ts">
  import { onMount } from "svelte";
  import { emitOpenProjectMessage } from "$lib/tools/messages";
  import { ToolManager, ToolName } from "$lib/tools";
  import { editorPanelVisible, savingProject } from "$lib/states/editor";

  import EditorPanel from "./editor/EditorPanel.svelte";
  import LayersPanel from "./layers/LayersPanel.svelte";
  import ElementsPanel from "./elements/ElementsPanel.svelte";

  let activeToolName: ToolName | undefined = ToolName.EDIT;
  let toolManager: ToolManager = new ToolManager(activeToolName);

  $: toolManager?.selectTool(activeToolName);

  onMount(() => {
    editorPanelVisible.set(true);
  });

  export function getActiveToolName() {
    return activeToolName;
  }

  export function updateTool(toolName: ToolName) {
    activeToolName = toolName;
    toolManager?.selectTool(toolName);
  }

  function toggleEditing() {
    activeToolName =
      activeToolName === ToolName.EDIT ? undefined : ToolName.EDIT;
  }

  function saveProject() {
    savingProject.set(true);
    emitOpenProjectMessage();
    // Just in case, disable saving state after 10 seconds
    setTimeout(() => savingProject.set(false), 10000);
  }
</script>

<EditorPanel editTool={toolManager?.editTool} />
<LayersPanel editTool={toolManager?.editTool} />
<ElementsPanel editTool={toolManager?.editTool} />
