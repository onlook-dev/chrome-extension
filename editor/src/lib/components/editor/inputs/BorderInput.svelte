<script lang="ts">
    import { slide } from "svelte/transition";
    import TextInput from "./TextInput.svelte";
    import {
        ElementStyleType,
        type ElementStyle,
    } from "$lib/tools/selection/styles";
    import ColorInput from "./ColorInput.svelte";
    import NumberUnitInput from "./NumberUnitInput.svelte";
    import SelectInput from "./SelectInput.svelte";

    export let elementStyles: ElementStyle[] = [];
    export let updateElementStyle = (key: string, value: string) => {};

    $: showGroup = elementStyles.some(
        (elementStyle) =>
            elementStyle.key === "borderWidth" &&
            !(elementStyle.value === "0px"),
    );

    $: if (!showGroup) {
        elementStyles.map((elementStyle) => {
            if (elementStyle.key === "borderColor")
                elementStyle.value = "initial";
        });
    }

    let colorUpdate = (key: string, value: string) => {
        if (key === "borderColor") {
            if (value === "" || value === "initial") {
                // Clear out borders
                updateElementStyle("borderWidth", "0px");
                showGroup = false;
            } else {
                showGroup = true;
            }
        }
        updateElementStyle(key, value);
    };
</script>

<div class="flex flex-col gap-2 mb-2">
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
            <div transition:slide class="ml-2 flex flex-row items-center">
                <div class="text-tertiary">
                    <p class="text-xs text-left">
                        {elementStyle.displayName}
                    </p>
                </div>
                <div class="w-32 ml-auto">
                    {#if elementStyle.type === ElementStyleType.Select}
                        <SelectInput {elementStyle} {updateElementStyle} />
                    {:else if elementStyle.type === ElementStyleType.Number}
                        <NumberUnitInput {elementStyle} {updateElementStyle} />
                    {:else}
                        <TextInput {elementStyle} {updateElementStyle} />
                    {/if}
                </div>
            </div>
        {/if}
    {/each}
</div>
