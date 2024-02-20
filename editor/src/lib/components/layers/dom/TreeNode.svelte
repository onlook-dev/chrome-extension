<!-- svelte-ignore a11y-mouse-events-have-key-events -->
<script lang="ts">
  import { TagMap } from "$lib/tools/selection/tag";
  import { ChevronDown } from "radix-icons-svelte";
  export let node: HTMLElement | undefined;
  export let selected: HTMLElement | undefined;
  export let hovered: HTMLElement | undefined;
  export let depth = 0;

  export let select: (e: Event, node: HTMLElement) => void;
  export let mouseEnter: (e: Event, node: HTMLElement) => void;

  const offset = 11;

  let nodeRef: HTMLDivElement;
  let isText = node && node.nodeType == Node.TEXT_NODE;
  let isEmpty = node && node.childNodes.length == 0;
  let isEmptyText = isText && node?.nodeValue?.trim() == "";
  let hasOnlyChild =
    node &&
    node.childNodes.length == 1 &&
    node?.firstChild?.nodeType == Node.TEXT_NODE;

  let name =
    node &&
    node.tagName &&
    (TagMap[node.tagName.toLowerCase()].title ||
      capitalizeFirstLetter(node.tagName.toLowerCase()));
  let isOpen = true;
  let selfSelected = false;

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

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
  $: selectedClass = isSelected
    ? "bg-red rounded text-white font-semibold"
    : "";
  $: hoverClass = isHovered ? "bg-red/20 rounded" : "";

  $: childrenSelectedClass = isSelected
    ? "bg-[#38040c] rounded-b rounded-t-none font-normal text-white/60"
    : "";

  const marginTop = "py-1";
</script>

<div bind:this={nodeRef}>
  {#if isEmptyText}
    <!-- Nothing -->
  {:else if isText}
    <!-- Show text -->
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div
      on:click={(e) => select(e, node)}
      on:mouseover={(e) => mouseEnter(e, node)}
      class="pl-[{offset *
        (depth + 1)}px] {hoverClass} {selectedClass} {marginTop}"
    >
      {'"' + node.nodeValue + '"'}
    </div>
  {:else if isEmpty}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div
      on:click={(e) => select(e, node)}
      on:mouseover={(e) => mouseEnter(e, node)}
      class="pl-[{offset *
        (depth + 1)}px] {hoverClass} {selectedClass} {marginTop}"
    >
      {name + " "}
    </div>
  {:else if hasOnlyChild}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div
      on:click={(e) => select(e, node)}
      on:mouseover={(e) => mouseEnter(e, node)}
      class="pl-[{offset *
        (depth + 1)}px] {hoverClass} {selectedClass} {marginTop}"
    >
      {name + " "}<span>{node.firstChild.nodeValue}</span>
    </div>
  {:else}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
    <details
      bind:open={isOpen}
      on:click|self={(e) => select(e, node)}
      on:mouseover|self={(e) => mouseEnter(e, node)}
      class="{hoverClass} {selectedClass}"
    >
      <summary
        class="ml-[calc({offset *
          (depth +
            1)}px-0.75rem)] list-none cursor-pointer flex flex-row items-center {marginTop}"
        on:mouseover={(e) => mouseEnter(e, node)}
        tabIndex="-1"
      >
        <ChevronDown
          class="w-3 h-3 inline-block {isOpen
            ? 'transform rotate-0'
            : 'transform -rotate-90'}"
        ></ChevronDown>
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <p class="w-full" on:click|preventDefault={(e) => select(e, node)}>
          {name}
        </p>
      </summary>
      <div class={childrenSelectedClass}>
        {#if isOpen}
          {#each node.childNodes as child}
            <svelte:self
              node={child}
              depth={depth + 1}
              {selected}
              {hovered}
              {select}
              {mouseEnter}
            />
          {/each}
        {/if}
      </div>
    </details>
  {/if}
</div>
