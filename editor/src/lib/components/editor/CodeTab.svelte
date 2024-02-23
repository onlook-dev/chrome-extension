<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { CodeMirror } from "$lib/components/ui/codemirror";
  import { onDestroy, onMount } from "svelte";
  import { websocketService } from "$lib/websocketService";
  import {
    javascript,
    jsxLanguage,
    tsxLanguage,
    typescriptLanguage,
  } from "@codemirror/lang-javascript";
  import { html } from "@codemirror/lang-html";
  import { css } from "@codemirror/lang-css";
  import { oneDark } from "@codemirror/theme-one-dark";
  import { svelte } from "@replit/codemirror-lang-svelte";
  import { draggable } from "@neodrag/svelte";
  import type { EditTool } from "$lib/tools/edit";
  import { getDataOnlookId } from "$lib/tools/utilities";

  export let editTool: EditTool;

  let fileContent = "";
  let original = "";
  let visible = false;
  let language = "js";
  let codemirror: CodeMirror;

  // Selection state
  let path = "";
  let startLine = 0;
  let endLine = 0;
  let el: HTMLElement | undefined = undefined;

  // Codemirror editor
  const languageMap = {
    js: javascript(),
    jsx: jsxLanguage,
    ts: typescriptLanguage,
    tsx: tsxLanguage,
    html: html(),
    css: css(),
    svelte: svelte(),
  };

  let unsubSocket: () => void;
  let unsubsSelector: (() => void)[] = [];

  onMount(() => {
    unsubsSelector.push(
      editTool.selectorEngine.selectedStore.subscribe(selectedElementsChanged)
    );
  });

  onDestroy(() => {
    unsubsSelector.forEach((unsub) => unsub());
    disconnect();
  });

  export function setPath(value: string) {
    const [filePath, start, end] = value.split(":");
    path = filePath;
    startLine = parseInt(start);
    endLine = parseInt(end);

    // Get suffix
    const pathSplit = path.split(".");
    language = pathSplit[pathSplit.length - 1];

    // Create new connection based on path
    connect(path);
  }

  function handleMessage(message: any): void {
    if (message.type === "readFile") {
      original = message.content;
      fileContent = message.content;

      // TODO: Handle this better
      setTimeout(() => {
        codemirror.highlightLines(startLine, endLine);
        codemirror.scrollToLine(startLine);
      }, 100);
    }
  }

  function selectedElementsChanged(selected: HTMLElement[]) {
    // TODO: Handle multiple elements. Show similar values and leave non-similar ones blank
    if (selected.length !== 1) return;
    el = selected[0];
    const path = getDataOnlookId(el);
    if (path) {
      setPath(path);
    }
  }

  function connect(path: string) {
    websocketService.connect(path);
    unsubSocket = websocketService.subscribe(handleMessage);
  }

  function disconnect() {
    if (unsubSocket) unsubSocket();
    websocketService.disconnect();
  }

  function saveContent() {
    websocketService.sendMessage({
      type: "writeFile",
      path: path,
      content: fileContent,
    });
  }

  function undoChanges() {
    fileContent = original;
    websocketService.sendMessage({
      type: "writeFile",
      path: path,
      content: original,
    });
  }
</script>

<div class="flex flex-col">
  <CodeMirror
    class="rounded border border-border bg-black bg-opacity-80 resize-none"
    styles={{
      "&": {
        borderRadius: "0.5rem",
        width: "500px",
        maxWidth: "100%",
        height: "20rem",
      },
    }}
    bind:value={fileContent}
    bind:this={codemirror}
    lang={languageMap[language] || javascript()}
    theme={oneDark}
  />

  <div class="flex mt-2 space-x-4">
    <Button
      variant="secondary"
      class="rounded-full opacity-80 mr-4"
      on:click={undoChanges}>undo</Button
    >
    <Button
      variant="secondary"
      class="rounded-full opacity-80 ml-4"
      on:click={saveContent}>save</Button
    >
  </div>
</div>
