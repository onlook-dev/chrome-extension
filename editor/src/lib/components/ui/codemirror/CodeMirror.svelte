<script context="module"></script>

<script lang="ts">
  import { createEventDispatcher, onDestroy, onMount } from "svelte";
  import { basicSetup } from "codemirror";
  import {
    EditorView,
    keymap,
    placeholder as placeholderExt,
    Decoration,
    ViewUpdate,
  } from "@codemirror/view";
  import { EditorState, StateEffect, StateField } from "@codemirror/state";
  import { indentWithTab } from "@codemirror/commands";
  import { indentUnit } from "@codemirror/language";
  import { debounce } from "./util";
  let classes = "";
  export { classes as class };
  export let value = "";
  export let basic = true;
  export let lang = void 0;
  export let theme = void 0;
  export let extensions = [];
  export let useTab = true;
  export let tabSize = 2;
  export let styles = void 0;
  export let lineWrapping = false;
  export let editable = true;
  export let readonly = false;
  export let placeholder = void 0;
  export let nodebounce = false;
  const is_browser = typeof window !== "undefined";
  const dispatch = createEventDispatcher();
  let element;
  let view: EditorView;
  let update_from_prop = false;
  let update_from_state = false;
  let first_config = true;
  let first_update = true;
  $: state_extensions = [
    ...get_base_extensions(
      basic,
      useTab,
      tabSize,
      lineWrapping,
      placeholder,
      editable,
      readonly,
      lang
    ),
    ...get_theme(theme, styles),
    ...extensions,
    lineHighlightField,
  ];
  $: view && update(value);
  $: view && state_extensions && reconfigure();
  $: on_change = nodebounce ? handle_change : debounce(handle_change, 300);
  onMount(() => (view = create_editor_view()));
  onDestroy(() => view?.destroy());

  function create_editor_view() {
    return new EditorView({
      parent: element,
      state: create_editor_state(value),
      dispatch(transaction) {
        view.update([transaction]);
        if (!update_from_prop && transaction.docChanged) {
          on_change();
        }
      },
    });
  }

  function reconfigure() {
    if (first_config) {
      first_config = false;
      return;
    }
    view.dispatch({
      effects: StateEffect.reconfigure.of(state_extensions),
    });
  }

  function update(value2) {
    if (first_update) {
      first_update = false;
      return;
    }
    if (update_from_state) {
      update_from_state = false;
      return;
    }
    update_from_prop = true;
    view.setState(create_editor_state(value2));
    update_from_prop = false;
  }

  function handle_change() {
    const new_value = view.state.doc.toString();
    if (new_value === value) return;
    update_from_state = true;
    value = new_value;
    dispatch("change", value);
  }

  function create_editor_state(value2) {
    return EditorState.create({
      doc: value2 ?? void 0,
      extensions: state_extensions,
    });
  }

  function get_base_extensions(
    basic2,
    useTab2,
    tabSize2,
    lineWrapping2,
    placeholder2,
    editable2,
    readonly2,
    lang2
  ) {
    const extensions2 = [
      indentUnit.of(" ".repeat(tabSize2)),
      EditorView.editable.of(editable2),
      EditorState.readOnly.of(readonly2),
    ];
    if (basic2) extensions2.push(basicSetup);
    if (useTab2) extensions2.push(keymap.of([indentWithTab]));
    if (placeholder2) extensions2.push(placeholderExt(placeholder2));
    if (lang2) extensions2.push(lang2);
    if (lineWrapping2) extensions2.push(EditorView.lineWrapping);

    return extensions2;
  }

  function get_theme(theme2, styles2) {
    const extensions2 = [];
    if (styles2) extensions2.push(EditorView.theme(styles2));
    if (theme2) extensions2.push(theme2);
    return extensions2;
  }

  const addLineHighlight = StateEffect.define<{ from: number; to: number }>();
  const lineHighlightField = StateField.define({
    create() {
      return Decoration.none;
    },
    update(lines, tr) {
      lines = lines.map(tr.changes);
      for (let e of tr.effects) {
        if (e.is(addLineHighlight)) {
          const { from, to } = e.value;
          const decorations = [];
          for (let pos = from; pos <= to; ) {
            const line = tr.state.doc.lineAt(pos);
            decorations.push(lineHighlightMark.range(line.from));
            pos = line.to + 1; // Move to the start of the next line
          }
          lines = Decoration.set(decorations, true);
        }
      }
      return lines;
    },
    provide: (f) => EditorView.decorations.from(f),
  });

  const lineHighlightMark = Decoration.line({
    attributes: { style: "background-color: rgba(74, 180, 255, 0.3)" },
  });

  // Function to highlight and scroll
  export function scrollToLine(startLine) {
    // Scroll to start
    const currentScroll = view.scrollDOM.scrollTop || 0;
    const start = view.coordsAtPos(view.state.doc.line(startLine).from) || {
      top: 0,
    };
    const bounds = view.scrollDOM.getBoundingClientRect();
    const top = start.top - bounds.top + currentScroll;
    view.scrollDOM.scrollTo({ top, behavior: "smooth" });
  }

  export function highlightLines(startLine, endLine) {
    if (startLine <= 0) return;
    const startPos = view.state.doc.line(startLine).from;
    const endPos = view.state.doc.line(endLine).from;
    view.dispatch({
      effects: addLineHighlight.of({ from: startPos, to: endPos }),
    });
  }
</script>

{#if is_browser}
  <div class="codemirror-wrapper {classes}" bind:this={element} />
{:else}
  <div class="scm-waiting {classes}">
    <div class="scm-waiting__loading scm-loading">
      <div class="scm-loading__spinner" />
      <p class="scm-loading__text">Loading editor...</p>
    </div>

    <pre class="scm-pre cm-editor">{value}</pre>
  </div>
{/if}

<style>
  .codemirror-wrapper :global(.cm-focused) {
    outline: none;
  }

  .scm-waiting {
    position: relative;
  }
  .scm-waiting__loading {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background-color: rgba(255, 255, 255, 0.5);
  }

  .scm-loading {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .scm-loading__spinner {
    width: 1rem;
    height: 1rem;
    border-radius: 100%;
    border: solid 2px #000;
    border-top-color: transparent;
    margin-right: 0.75rem;
    animation: spin 1s linear infinite;
  }
  .scm-loading__text {
    font-family: sans-serif;
  }
  .scm-pre {
    font-size: 0.85rem;
    font-family: monospace;
    tab-size: 2;
    -moz-tab-size: 2;
    resize: none;
    pointer-events: none;
    user-select: none;
    overflow: auto;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>
