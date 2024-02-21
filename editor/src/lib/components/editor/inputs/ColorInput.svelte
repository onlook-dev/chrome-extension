<script lang="ts">
  import Color from "colorjs.io";
  import type { ElementStyle } from "$lib/tools/selection/styles";

  export let elementStyle: ElementStyle;
  export let updateElementStyle: (key: string, value: string) => void;
  let inputString = "#000000";

  $: if (elementStyle.value) {
    try {
      inputString = expandShorthandHex(
        new Color(elementStyle.value).toString({ format: "hex" })
      );
    } catch (e) {
      console.error("Error parsing color", e);
      inputString = "#000000";
    }
  }

  function expandShorthandHex(hex: string) {
    if (hex.length <= 5) {
      return `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`;
    }
    return hex;
  }
</script>

<div
  class="flex flex-row gap-1 justify-end items-center rounded-lg cursor-pointer"
>
  <div
    class="overflow-hidden rounded-full w-5 h-5 border border-border relative"
  >
    <input
      type="color"
      class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full h-10 w-10 cursor-pointer"
      value={inputString}
      on:input={(event) => {
        inputString = event.currentTarget.value;
        updateElementStyle(elementStyle.key, event.currentTarget.value);
      }}
    />
  </div>

  <input
    class="w-[3.5rem] text-xs border-none text-text bg-transparent text-end focus:outline-none focus:ring-0"
    type="text"
    value={inputString}
    placeholder="--"
    on:input={(event) => {
      inputString = event.currentTarget.value;
      updateElementStyle(elementStyle.key, event.currentTarget.value);
    }}
  />
</div>
