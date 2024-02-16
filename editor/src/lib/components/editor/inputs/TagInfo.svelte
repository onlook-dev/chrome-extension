<script lang="ts">
  import { TagMap } from "$lib/tools/selection/tag";
  import { slide } from "svelte/transition";
  export let el: HTMLElement;
  let showMore = false;

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
</script>

<button
  class="text-start w-full p-2 mb-3 bg-stone-800 rounded text-xs cursor-pointer"
  on:click={() => (showMore = !showMore)}
>
  <p class="space-x-1">
    <span>{capitalizeFirstLetter(el.tagName.toLowerCase())}</span>
    <span
      >{TagMap[el.tagName.toLowerCase()].title.toLowerCase() ==
      el.tagName.toLowerCase()
        ? ""
        : `${TagMap[el.tagName.toLowerCase()].title}`}</span
    >
  </p>
  {#if showMore}
    <div transition:slide>
      <p class="pt-2">
        {TagMap[el.tagName.toLowerCase()].description}
      </p>
      <p class="pt-2 text-xs underline">
        <a
          href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element"
          target="_blank">Learn more</a
        >
      </p>
    </div>
  {/if}
</button>
