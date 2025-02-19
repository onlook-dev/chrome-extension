<script lang="ts">
  import { Reload, Shadow } from "radix-icons-svelte";
  import { Button } from "$lib/components/ui/button";
  import { CodeMirror } from "$lib/components/ui/codemirror";
  import { onDestroy, onMount } from "svelte";
  import { websocketService } from "$lib/websocket";
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
  import type { EditTool } from "$lib/tools/edit";
  import { getDataOnlookId } from "$lib/tools/utilities";
  import hotkeys from "hotkeys-js";
  import { slide } from "svelte/transition";

  export let editTool: EditTool;

  let fileContent = "";
  let original = "";
  let language = "js";
  let codemirror: CodeMirror;

  // Selection state
  let connected = false;
  let connecting = false;

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
      editTool.selectorEngine.selectedStore.subscribe(selectedElementsChanged),
    );
    handshake();
  });

  onDestroy(() => {
    unsubsSelector.forEach((unsub) => unsub());
    disconnect();
  });

  function handshake() {
    if (connecting || connected) return;
    connecting = true;
    websocketService
      .handshake()
      .then((success) => {
        connected = success;
      })
      .catch(() => {
        connected = false;
      })
      .finally(() => {
        connecting = false;
      });
  }

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

      // TODO: Handle this better. Waiting for content to load first. Use codemirror callback.
      setTimeout(() => {
        codemirror.highlightLines(startLine, endLine);
        codemirror.scrollToLine(startLine);
      }, 100);
    }
  }

  function selectedElementsChanged(selected: HTMLElement[]) {
    if (!connected) return;
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
    hotkeys("CMD+s", (event) => {
      event.preventDefault();
      saveContent();
    });
  }

  function disconnect() {
    if (unsubSocket) unsubSocket();
    websocketService.disconnect();
    hotkeys.unbind("CMD+s");
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
  {#if connected}
    <CodeMirror
      class="rounded border border-border bg-transparent bg-opacity-80 resize-none"
      styles={{
        "&": {
          backgroundColor: "rgba(0, 0, 0, 0)",
          borderRadius: "0.5rem",
          width: "500px",
          maxWidth: "100%",
          height: "65vh",
        },
        ".cm-gutters": {
          backgroundColor: "rgb(33,33,32)",
        },
      }}
      bind:value={fileContent}
      bind:this={codemirror}
      lang={languageMap[language] || javascript()}
      theme={oneDark}
    />

    <div class="flex flex-row mt-2 space-x-4 ml-auto">
      <Button variant="secondary" class="opacity-80 mr-4" on:click={undoChanges}
        >Reset</Button
      >
      <Button variant="secondary" class="opacity-80 ml-4" on:click={saveContent}
        >Save</Button
      >
    </div>
  {:else}
    <div
      class="mt-4 flex flex-col items-center justify-center h-full text-center"
    >
      <p class="text-sm text-text/80">
        No code server connection<br />Make sure app is hosted with Onlook
      </p>
      <div transition:slide>
        <Button class="mt-4" on:click={handshake} disabled={connecting}>
          {#if connecting}
            <div transition:slide={{ axis: "x" }}>
              <Shadow class="h-4 w-4 mr-2 animate-spin" />
            </div>
          {/if}
          {connecting ? "Connecting" : "Reconnect"}
        </Button>
      </div>
    </div>
  {/if}
</div>
