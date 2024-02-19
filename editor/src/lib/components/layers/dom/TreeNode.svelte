<!-- svelte-ignore a11y-mouse-events-have-key-events -->
<script lang="ts">
  import DomAttrib from "./NodeAttr.svelte";

  const offset = 11;

  export let node: HTMLElement | undefined;
  export let selected: HTMLElement | undefined;
  export let hovered: HTMLElement | undefined;
  export let depth = 0;

  let nodeRef: HTMLDivElement;
  let isText = node && node.nodeType == Node.TEXT_NODE;
  let isEmpty = node && node.childNodes.length == 0;
  let isEmptyText = isText && node?.nodeValue?.trim() == "";
  let hasOnlyChild =
    node &&
    node.childNodes.length == 1 &&
    node?.firstChild?.nodeType == Node.TEXT_NODE;
  let name = node && node.tagName && node.tagName.toLowerCase();
  let isOpen = true;
  let selfSelected = false;

  $: isSelected = node == selected;
  $: isHovered = node == hovered;
  $: {
    if (isSelected) {
      if (!selfSelected && nodeRef) {
        nodeRef.scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "start",
        });
        selfSelected = false;
      }
    }
  }

  let select = (e: any) => {
    if (selected == node) return;
    selfSelected = true;
    selected = node;
  };
  let mouseEnter = (e: any) => {
    if (hovered == node) return;
    hovered = node;
  };
</script>

<div bind:this={nodeRef}>
  {#if isEmptyText}
    <!-- Nothing -->
  {:else if isText}
    <!-- Show text -->
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div
      on:click={select}
      on:mouseover={mouseEnter}
      class="pl-[{offset * (depth + 1)}px] {isSelected
        ? 'bg-red'
        : ''} {isHovered ? 'bg-red-800' : ''}"
    >
      {'"' + node.nodeValue + '"'}
    </div>
  {:else if isEmpty}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div
      on:click={select}
      on:mouseover={mouseEnter}
      class="pl-[{offset * (depth + 1)}px] {isSelected
        ? 'bg-red'
        : ''} {isHovered ? 'bg-red-800' : ''}"
    >
      {name + " "}<DomAttrib {node} />
    </div>
  {:else if hasOnlyChild}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div
      on:click={select}
      on:mouseover={mouseEnter}
      class="pl-[{offset * (depth + 1)}px] {isSelected
        ? 'bg-red'
        : ''} {isHovered ? 'bg-red-800' : ''}"
    >
      {name + " "}<DomAttrib {node} /><span class="text_text"
        >{node.firstChild.nodeValue}</span
      >
    </div>
  {:else}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
    <details
      bind:open={isOpen}
      on:click|self={select}
      class="{isSelected ? 'bg-red' : ''} {isHovered ? 'bg-red-800' : ''}"
      on:mouseover|self={mouseEnter}
    >
      <summary
        class="ml-[{offset * (depth + 1)}px]"
        on:mouseover={mouseEnter}
        tabIndex="-1"
      >
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <span class="text_tag summary_span" on:click|preventDefault={select}>
          {name}<DomAttrib {node} />
          {#if !isOpen}
            <span class="text_text">…</span>
          {/if}
        </span>
      </summary>
      {#if isOpen}
        {#each node.childNodes as child}
          <svelte:self
            node={child}
            depth={depth + 1}
            bind:selected
            bind:hovered
          />
        {/each}
      {/if}
    </details>
  {/if}
</div>
