<script lang="ts">
  import * as Card from "$lib/components/ui/card";
  import * as ToggleGroup from "$lib/components/ui/toggle-group";
  import { ChatBubble } from "radix-icons-svelte";
  import ToolBarAnimation from "./ToolbarAnimation.svelte";
  import { onMount } from "svelte";
  import { Editor, ToolName } from "$lib/tools";
  import { Pencil2 } from "radix-icons-svelte";
  import EditorPanel from "../editor/EditorPanel.svelte";

  let editorPanel: EditorPanel;
  let editor;
  let selected = ToolName.EDIT;

  onMount(() => {
    editor = new Editor(selected, editorPanel);
  });

  $: editor?.selectTool(selected);
</script>

<div class="fixed bottom-3 left-0 right-0 flex justify-center">
  <ToolBarAnimation>
    <Card.Root class="opacity-[98%] border p-1 rounded-full">
      <ToggleGroup.Root type="single" bind:value={selected}>
        <ToggleGroup.Item
          class="rounded-full"
          value={ToolName.EDIT}
          aria-label="Toggle edit"
          on:keydown={null}
        >
          <Pencil2 class="h-4 w-4 mr-2" />
          Edit
        </ToggleGroup.Item>
        <ToggleGroup.Item
          class="rounded-full"
          value={ToolName.COMMENT}
          aria-label="Toggle comment"
        >
          <ChatBubble class="h-4 w-4 mr-2" />
          Comment
        </ToggleGroup.Item>
      </ToggleGroup.Root>
    </Card.Root>
  </ToolBarAnimation>
</div>

<EditorPanel bind:this={editorPanel} />
