<script lang="ts">
  import type { ElementStyle } from "$lib/tools/selection/styles";
  export let elementStyle: ElementStyle;
  export let updateElementStyle: (key: string, value: string) => void;
  export let unitEnd: boolean = false;
</script>

{#if elementStyle}
  <div class="flex flex-row gap-1 justify-end">
    <input
      type="number"
      class="text-xs w-8 border-none text-text bg-background text-end focus:outline-none focus:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      placeholder="--"
      value={elementStyle.value}
    />

    <select
      name={elementStyle.displayName}
      class="text-xs min-w-fit w-6 border-none text-text bg-background appearance-none {unitEnd
        ? 'text-end'
        : 'text-start'} focus:outline-none focus:ring-0"
      on:input={(event) => {
        updateElementStyle(elementStyle.key, event.target.value);
      }}
    >
      {#each elementStyle.units ?? [] as option}
        <option value={option}>{option}</option>
      {/each}
    </select>
  </div>
{/if}
