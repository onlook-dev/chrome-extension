<script lang="ts">
    import {
        BorderAll,
        BorderBottom,
        BorderLeft,
        BorderRight,
        BorderTop,
        Corners,
    } from "radix-icons-svelte";
    import { slide } from "svelte/transition";

    import TextInput from "./TextInput.svelte";
    import * as ToggleGroup from "$lib/components/ui/toggle-group";
    import type { ElementStyle } from "$lib/tools/selection/styles";
    import ColorInput from "./ColorInput.svelte";

    export let elementStyles: ElementStyle[] = [];
    export let updateElementStyle = (key: string, value: string) => {};
    let showGroup = false;
</script>

<div class="grid grid-cols-2 gap-2 mb-2">
    {#each elementStyles as elementStyle}
        {#if elementStyle.key === "borderColor" || elementStyle.key === "shadowColor"}
            <div class="flex flex-row items-center col-span-2">
                <p class="text-xs text-left text-tertiary">
                    {elementStyle.displayName}
                </p>
                <div class="ml-auto h-8 flex flex-row w-32 space-x-2">
                    <ColorInput {elementStyle} {updateElementStyle} />
                </div>
            </div>
        {:else if showGroup}
            <div transition:slide class="flex flex-row items-center">
                <div class="w-12 text-tertiary">
                    {#if elementStyle.displayName === "Top"}
                        <BorderTop class="w-4 h-4" />
                    {:else if elementStyle.displayName === "Bottom"}
                        <BorderBottom class="w-4 h-4 0" />
                    {:else if elementStyle.displayName === "Right"}
                        <BorderRight class="w-4 h-4 " />
                    {:else if elementStyle.displayName === "Left"}
                        <BorderLeft class="w-4 h-4 " />
                    {:else}
                        <p class="text-xs text-left">
                            {elementStyle.displayName}
                        </p>
                    {/if}
                </div>

                <TextInput {elementStyle} {updateElementStyle} />
            </div>
        {/if}
    {/each}
</div>
