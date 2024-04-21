<script lang="ts">
  import { stringToHex } from "$lib/tools/edit/colors";
  import type { ElementStyle } from "$lib/tools/selection/styles";
  export let elementStyle: ElementStyle;
  export let updateElementStyle: (key: string, value: string) => void;
  import { parse } from "culori";
  import { Cross2, Plus } from "radix-icons-svelte";

  let colorInputRef;
  $: inputString = stringToHex(elementStyle.value);
  $: isNoneInput = inputString === "initial" || inputString === "";
</script>

<div
  class="w-32 p-[6px] gap-2 bg-surface flex flex-row rounded-sm cursor-pointer"
>
  <div
    class="overflow-hidden w-5 h-5 border-transparent rounded-[2px] relative"
  >
    <input
      bind:this={colorInputRef}
      type="color"
      class="border-transparent absolute w-10 h-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
      value={inputString}
      on:input={(event) => {
        inputString = event.currentTarget.value;
        updateElementStyle(elementStyle.key, event.currentTarget.value);
      }}
    />
  </div>

  <input
    class="w-16 text-xs border-none text-text bg-transparent text-start focus:outline-none focus:ring-0"
    type="text"
    value={inputString === "initial" ? "" : inputString}
    placeholder="None"
    on:keydown={(e) => {
      if (e.key === "Enter") {
        e.currentTarget.blur();
        return;
      }
    }}
    on:input={(event) => {
      if (parse(event.currentTarget.value) === undefined) {
        console.error("Invalid color");
        return;
      }
      inputString = event.currentTarget.value;
      updateElementStyle(elementStyle.key, event.currentTarget.value);
    }}
  />
  <button
    class="text-tertiary"
    on:click={() => {
      inputString = isNoneInput ? "#000000" : "";
      updateElementStyle(elementStyle.key, inputString);
    }}
  >
    {#if isNoneInput}
      <Plus />
    {:else}
      <Cross2 />
    {/if}
  </button>
</div>
