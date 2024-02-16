<script lang="ts">
  import type { ElementStyle } from "$lib/tools/selection/styles";
  import NumberUnitInput from "./NumberUnitInput.svelte";

  export let elementStyles: ElementStyle[] = [];
  export let updateElementStyle = (key: string, value: string) => {};
</script>

<div class="mt-4 grid grid-cols-2 gap-x-4">
  <h2 class="pb-2 text-xs">Fixed Width</h2>
  <h2 class="pb-2 text-xs">Fixed Height</h2>
  {#each elementStyles as elementStyle}
    <div class="flex flex-row items-center pb-2">
      <div class="w-24">
        {#if elementStyle.key === "rotate"}
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3 3L3 9.46154M17 17L10.2692 17M10.2692 17L3 17L3 9.46154M10.2692 17L10.2692 16.7308C10.2692 12.7161 7.01468 9.46154 3 9.46154V9.46154"
              stroke="white"
              stroke-opacity="0.6"
              stroke-width="1.2"
            />
          </svg>
        {:else if elementStyle.key === "borderRadius"}
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clip-path="url(#clip0_138_14625)">
              <path
                d="M15.25 15.25H16.75V16.75H15.25V15.25ZM15.25 13.75H16.75V12.25H15.25V13.75ZM3.25 10.75H4.75V9.25H3.25V10.75ZM3.25 13.75H4.75V12.25H3.25V13.75ZM3.25 7.75H4.75V6.25H3.25V7.75ZM3.25 4.75H4.75V3.25H3.25V4.75ZM6.25 4.75H7.75V3.25H6.25V4.75ZM12.25 16.75H13.75V15.25H12.25V16.75ZM9.25 16.75H10.75V15.25H9.25V16.75ZM12.25 16.75H13.75V15.25H12.25V16.75ZM6.25 16.75H7.75V15.25H6.25V16.75ZM3.25 16.75H4.75V15.25H3.25V16.75ZM16.75 7C16.75 4.93 15.07 3.25 13 3.25H9.25V4.75H13C14.2375 4.75 15.25 5.7625 15.25 7V10.75H16.75V7Z"
                fill="white"
                fill-opacity="0.6"
              />
            </g>
            <defs>
              <clipPath id="clip0_138_14625">
                <rect
                  width="18"
                  height="18"
                  fill="white"
                  transform="translate(1 1)"
                />
              </clipPath>
            </defs>
          </svg>
        {:else}
          <p class="text-xs text-left opacity-60">
            {elementStyle.displayName}
          </p>
        {/if}
      </div>

      <NumberUnitInput {elementStyle} {updateElementStyle} />
    </div>
  {/each}
</div>
