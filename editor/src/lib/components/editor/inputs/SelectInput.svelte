<script lang="ts">
  import * as ToggleGroup from "$lib/components/ui/toggle-group";
  import type { ElementStyle } from "$lib/tools/selection/styles";
  import { ChevronDown } from "radix-icons-svelte";

  export let elementStyle: ElementStyle;
  export let updateElementStyle: (key: string, value: string) => void;
</script>

{#if elementStyle}
  {#if elementStyle.key === "textAlign"}
    <ToggleGroup.Root
      type="single"
      value={elementStyle.value}
      onValueChange={(val) => {
        if (!val) {
          updateElementStyle(elementStyle.key, "inherit");
          return;
        }
        updateElementStyle(elementStyle.key, val);
      }}
    >
      <ToggleGroup.Item class="px-1.5" value="start"
        ><svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clip-path="url(#clip0_134_5601)">
            <path
              d="M12.5 12.5H2.5V14.1667H12.5V12.5ZM12.5 5.83333H2.5V7.5H12.5V5.83333ZM2.5 10.8333H17.5V9.16667H2.5V10.8333ZM2.5 17.5H17.5V15.8333H2.5V17.5ZM2.5 2.5V4.16667H17.5V2.5H2.5Z"
              fill="white"
            />
          </g>
          <defs>
            <clipPath id="clip0_134_5601">
              <rect width="20" height="20" fill="white" />
            </clipPath>
          </defs>
        </svg>
      </ToggleGroup.Item>
      <ToggleGroup.Item value="center" class="px-1.5"
        ><svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clip-path="url(#clip0_134_5604)">
            <path
              d="M5.83333 12.5V14.1667H14.1667V12.5H5.83333ZM2.5 17.5H17.5V15.8333H2.5V17.5ZM2.5 10.8333H17.5V9.16667H2.5V10.8333ZM5.83333 5.83333V7.5H14.1667V5.83333H5.83333ZM2.5 2.5V4.16667H17.5V2.5H2.5Z"
              fill="white"
            />
          </g>
          <defs>
            <clipPath id="clip0_134_5604">
              <rect width="20" height="20" fill="white" />
            </clipPath>
          </defs>
        </svg>
      </ToggleGroup.Item>
      <ToggleGroup.Item value="end" class="px-1.5"
        ><svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clip-path="url(#clip0_134_5607)">
            <path
              d="M2.5 17.5H17.5V15.8333H2.5V17.5ZM7.5 14.1667H17.5V12.5H7.5V14.1667ZM2.5 10.8333H17.5V9.16667H2.5V10.8333ZM7.5 7.5H17.5V5.83333H7.5V7.5ZM2.5 2.5V4.16667H17.5V2.5H2.5Z"
              fill="white"
            />
          </g>
          <defs>
            <clipPath id="clip0_134_5607">
              <rect width="20" height="20" fill="white" />
            </clipPath>
          </defs>
        </svg>
      </ToggleGroup.Item>
    </ToggleGroup.Root>
  {:else}
    <div class="relative w-32">
      <select
        name={elementStyle.displayName}
        value={elementStyle.value}
        class="p-[6px] w-full px-2 text-start rounded border-none text-xs text-text bg-surface appearance-none focus:outline-none focus:ring-0 capitalize"
        on:input={(event) => {
          updateElementStyle(elementStyle.key, event.currentTarget.value);
        }}
      >
        {#if !elementStyle.options.includes(elementStyle.value)}
          <option value={elementStyle.value}>{elementStyle.value}</option>
        {/if}
        {#each elementStyle.options ?? [] as option}
          <option value={option}>{option}</option>
        {/each}
      </select>
      <div
        class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none"
      >
        <ChevronDown />
      </div>
    </div>
  {/if}
{/if}
