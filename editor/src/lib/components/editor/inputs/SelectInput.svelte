<script lang="ts">
  import type { ElementStyle } from "$lib/tools/selection/styles";

  export let elementStyle: ElementStyle;
  export let updateElementStyle: (key: string, value: string) => void;
</script>

{#if elementStyle}
  <select
    name={elementStyle.displayName}
    class="border-none text-xs text-text bg-background appearance-none text-end focus:outline-none focus:ring-0"
    on:input={(event) => {
      updateElementStyle(elementStyle.key, event.target.value);
    }}
  >
    {#each elementStyle.options ?? [] as option}
      <option value={option}>{option}</option>
    {/each}
  </select>
{/if}
