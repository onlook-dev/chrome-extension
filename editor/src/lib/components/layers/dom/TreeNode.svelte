<!-- svelte-ignore a11y-mouse-events-have-key-events -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->

<script lang="ts">
  import { TagMap } from "$lib/tools/selection/tag";
  import { ChevronDown } from "radix-icons-svelte";
  import { DATA_ONLOOK_IGNORE, IGNORE_TAGS } from "$lib/constants";
  import { onMount } from "svelte";
  import { slide } from "svelte/transition";
  import { layersPanelCollapsed } from "$lib/states/editor";
  import NodeIcon from "./NodeIcon.svelte";

  export let node: HTMLElement | undefined;
  export let selected: HTMLElement[];
  export let hovered: HTMLElement | undefined;
  export let depth = 0;
  export let internalHover = false;

  export let select: (e: Event, node: HTMLElement) => void;
  export let mouseEnter: (e: Event, node: HTMLElement) => void;

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
    (TagMap[node.tagName.toLowerCase()]?.title ||
      capitalizeFirstLetter(node.tagName.toLowerCase()));
  let isOpen = false;
  let selfSelected = false;
  let loaded = false;

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  $: if (isOpen) {
    loaded = true;
  }
  $: if (selected.length) {
    selected.forEach((el) => {
      if (node.contains(el) && node !== el) isOpen = true;
    });
  }
  $: isSelected = selected.includes(node);
  $: isHovered = node == hovered;
  $: selectedClass = isSelected
    ? "bg-red rounded text-white font-semibold"
    : "";
  $: hoverClass = isHovered ? "bg-red/20 rounded" : "";
  $: childrenSelectedClass = isSelected
    ? "bg-[#38040c] rounded-b rounded-t-none font-normal text-white/60"
    : "";
  $: iconClass = `shrink-0 h-3 w-3 ml-1 mr-2 ${isSelected ? "text-white" : "text-red"}`;
  $: if (isSelected && !selfSelected && !$layersPanelCollapsed) {
    nodeRef?.scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "start",
    });
    selfSelected = false;
  }
  const paddingY = "py-1";

  onMount(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Node is visible, proceed to load/render it
          if (!loaded) {
            isOpen = true;
          }
          observer.unobserve(entry.target);
        }
      });
    });

    const childNodeObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "childList") {
          // Handle child node changes here
          isEmpty = node && node.childNodes.length == 0;
          isEmptyText = isText && node?.nodeValue?.trim() == "";
          hasOnlyChild =
            node &&
            node.childNodes.length == 1 &&
            node?.firstChild?.nodeType == Node.TEXT_NODE;
        }
      });
    });

    if (node && node.nodeType == Node.ELEMENT_NODE && node.tagName !== "BODY") {
      childNodeObserver.observe(node, { childList: true });
    }

    if (nodeRef) {
      observer.observe(nodeRef);
    }

    // Cleanup
    return () => {
      if (nodeRef) {
        observer.unobserve(nodeRef);
      }
      if (node) {
        childNodeObserver.disconnect();
      }
    };
  });
</script>

{#if node && node instanceof Node && node.nodeType == Node.ELEMENT_NODE && !IGNORE_TAGS.includes(node.nodeName) && !node.hasAttribute(DATA_ONLOOK_IGNORE)}
  <div bind:this={nodeRef} class={depth > 0 ? "pl-2" : ""}>
    {#if isEmptyText}
      <!-- Nothing -->
    {:else if isText}
      <!-- Show text -->
      <div
        on:click={(e) => {
          select(e, node);
          selfSelected = true;
        }}
        on:mouseover={(e) => mouseEnter(e, node)}
        class=" {hoverClass} {selectedClass} {paddingY}"
      >
        {node.nodeValue}
      </div>
    {:else if isEmpty}
      <div
        on:click={(e) => {
          select(e, node);
          selfSelected = true;
        }}
        on:mouseover={(e) => mouseEnter(e, node)}
        class=" {hoverClass} {selectedClass} {paddingY} flex flex-row items-center pl-3"
      >
        <NodeIcon {node} {iconClass} />
        {name}
      </div>
    {:else if hasOnlyChild}
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      <div
        on:click={(e) => {
          select(e, node);
          selfSelected = true;
        }}
        on:mouseover={(e) => mouseEnter(e, node)}
        class=" {hoverClass} {selectedClass} {paddingY} flex flex-row items-center pl-3"
      >
        <NodeIcon {node} {iconClass} />
        <span class="text-ellipsis overflow-hidden">
          {node.firstChild.nodeValue || name}
        </span>
      </div>
    {:else}
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
      <details
        bind:open={isOpen}
        on:click|self={(e) => {
          select(e, node);
          selfSelected = true;
        }}
        on:mouseover|self={(e) => mouseEnter(e, node)}
        class=" {hoverClass} {selectedClass}"
      >
        <summary
          class="list-none cursor-pointer flex flex-row items-center {paddingY}"
          on:mouseover={(e) => mouseEnter(e, node)}
          tabIndex="-1"
        >
          <ChevronDown
            class="w-3 h-3 {isOpen
              ? 'transform rotate-0'
              : 'transform -rotate-90'} {internalHover
              ? 'visible'
              : 'invisible'}"
          ></ChevronDown>
          <NodeIcon {node} {iconClass} />
          <!-- svelte-ignore a11y-no-static-element-interactions -->
          <p
            class="flex-grow"
            on:click|preventDefault={(e) => {
              select(e, node);
              selfSelected = true;
            }}
          >
            {name}
          </p>
        </summary>
        <div class={childrenSelectedClass}>
          {#if isOpen}
            <div transition:slide>
              {#each node.childNodes as child}
                <svelte:self
                  node={child}
                  depth={depth + 1}
                  {selected}
                  {hovered}
                  {select}
                  {mouseEnter}
                  {internalHover}
                />
              {/each}
            </div>
          {/if}
        </div>
      </details>
    {/if}
  </div>
{/if}
