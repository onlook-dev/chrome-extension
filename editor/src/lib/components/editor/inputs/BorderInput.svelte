<script lang="ts">
    import {
        BorderBottom,
        BorderLeft,
        BorderRight,
        BorderTop,
    } from "radix-icons-svelte";
    import { slide } from "svelte/transition";

    import TextInput from "./TextInput.svelte";
    import type { ElementStyle } from "$lib/tools/selection/styles";
    import ColorInput from "./ColorInput.svelte";

    export let elementStyles: ElementStyle[] = [];
    export let updateElementStyle = (key: string, value: string) => {};

    $: showGroup = elementStyles.some(
        (elementStyle) =>
            elementStyle.key === "borderColor" &&
            !(elementStyle.value === "" || elementStyle.value === "initial"),
    );
    let colorUpdate = (key: string, value: string) => {
        if (key === "borderColor") {
            showGroup = !(value === "" || value === "initial");
        }
        updateElementStyle(key, value);
    };
</script>

<div class="grid grid-cols-2 gap-2 mb-2">
    {#each elementStyles as elementStyle}
        {#if elementStyle.key === "borderColor"}
            <div class="flex flex-row items-center col-span-2">
                <p class="text-xs text-left text-tertiary">
                    {elementStyle.displayName}
                </p>
                <div class="ml-auto h-8 flex flex-row w-32 space-x-2">
                    <ColorInput
                        {elementStyle}
                        updateElementStyle={colorUpdate}
                    />
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
