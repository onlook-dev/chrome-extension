<script lang="ts">
  import * as Card from "$lib/components/ui/card";
  import { ExternalLink, Pencil1, Stop } from "radix-icons-svelte";
  import ToolBarAnimation from "./ToolbarAnimation.svelte";
  import { onMount } from "svelte";
  import { Editor, ToolName } from "$lib/tools";
  import EditorPanel from "../editor/EditorPanel.svelte";
  import Button from "../ui/button/button.svelte";
  import { slide } from "svelte/transition";

  let editorPanel: EditorPanel;
  let editor;
  let selected: ToolName | undefined = ToolName.EDIT;

  onMount(() => {
    editor = new Editor(selected, editorPanel);
  });

  $: editor?.selectTool(selected);
</script>

<div class="fixed bottom-3 left-0 right-0 flex justify-center">
  <ToolBarAnimation>
    <Card.Root
      class="opacity-[98%] border p-1 space-x-2 rounded-full flex flex-row {selected ===
      ToolName.EDIT
        ? 'bg-red border-red'
        : ''}"
    >
      <Button
        class={selected === ToolName.EDIT
          ? "rounded-full bg-red hover:bg-red border-none"
          : "rounded-full border-none"}
        variant={selected === ToolName.EDIT ? "destructive" : "outline"}
        on:click={() =>
          (selected = selected === ToolName.EDIT ? undefined : ToolName.EDIT)}
      >
        {#if selected === ToolName.EDIT}
          <svg
            class="mr-2"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clip-path="url(#clip0_148_23526)">
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M7 13H13V7H7V13ZM10 2.5C5.86 2.5 2.5 5.86 2.5 10C2.5 14.14 5.86 17.5 10 17.5C14.14 17.5 17.5 14.14 17.5 10C17.5 5.86 14.14 2.5 10 2.5Z"
                fill="white"
              />
            </g>
            <defs>
              <clipPath id="clip0_148_23526">
                <rect
                  width="18"
                  height="18"
                  fill="white"
                  transform="translate(1 1)"
                />
              </clipPath>
            </defs>
          </svg>

          Stop Editing
        {:else}
          <Pencil1 class="h-4 w-4 mr-2" />
          Start Editing
        {/if}
      </Button>

      {#if selected !== ToolName.EDIT}
        <div transition:slide={{ axis: "x" }}>
          <Button class="rounded-full border-none" variant="outline"
            ><ExternalLink class="h-4 w-4 mr-2" />
            Open Project</Button
          >
        </div>
      {/if}
    </Card.Root>
  </ToolBarAnimation>
</div>

<EditorPanel bind:this={editorPanel} />
