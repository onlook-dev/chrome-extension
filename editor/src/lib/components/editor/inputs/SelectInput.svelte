<script lang="ts">
  import type { ElementStyle } from "$lib/tools/selection/styles";

  export let elementStyle: ElementStyle;
  export let updateElementStyle: (key: string, value: string) => void;
</script>

{#if elementStyle}
  <select
    name={elementStyle.displayName}
    value={elementStyle.value}
    class="border-none text-xs text-text bg-background appearance-none text-end focus:outline-none focus:ring-0 capitalize"
    on:input={(event) => {
      updateElementStyle(elementStyle.key, event.target.value);
    }}
  >
    {#if !elementStyle.options.includes(elementStyle.value)}
      <option value={elementStyle.value}>{elementStyle.value}</option>
    {/if}
    {#each elementStyle.options ?? [] as option}
      <option value={option}>{option}</option>
    {/each}
  </select>
{/if}
