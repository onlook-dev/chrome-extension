<script lang="ts">
    import { slide } from "svelte/transition";

    import TextInput from "./TextInput.svelte";
    import {
        ElementStyleType,
        type ElementStyle,
    } from "$lib/tools/selection/styles";
    import NumberUnitInput from "./NumberUnitInput.svelte";
    import SelectInput from "./SelectInput.svelte";
    import ColumnRowInput from "./ColumnRowInput.svelte";

    export let elementStyles: ElementStyle[] = [];
    export let updateElementStyle = (
        key: string,
        value: string,
        refresh?: boolean,
    ) => {};

    enum DisplayType {
        flex = "flex",
        grid = "grid",
        block = "block",
    }

    const DisplayGroup = {
        [DisplayType.flex]: [
            "flexDirection",
            "justifyContent",
            "alignItems",
            "gap",
        ],
        [DisplayType.grid]: ["gridTemplateColumns", "gridTemplateRows", "gap"],
    };

    let type: DisplayType;

    $: elementStyles.map((elementStyle) => {
        if (elementStyle.key === "display")
            type = elementStyle.value as DisplayType;
    });

    let updatedUpdateStyle = (key: string, value: string) => {
        if (key === "display") {
            type = value as DisplayType;
            elementStyles.map((elementStyle) => {
                if (elementStyle.key === "display") {
                    elementStyle.value = value;
                }
            });
        }
        updateElementStyle(key, value, true);
    };
</script>

<div class="flex flex-col gap-2 mb-2">
    {#each elementStyles as elementStyle}
        {#if elementStyle.key === "display"}
            <div class="flex flex-row items-center col-span-2">
                <p class="text-xs text-left text-tertiary">
                    {elementStyle.displayName}
                </p>
                <div class="ml-auto h-8 flex flex-row w-32 space-x-2">
                    <SelectInput
                        {elementStyle}
                        updateElementStyle={updatedUpdateStyle}
                    />
                </div>
            </div>
        {:else if DisplayGroup[type] && DisplayGroup[type].includes(elementStyle.key)}
            <div transition:slide class="ml-2 flex flex-row items-center">
                <div class="text-tertiary">
                    <p class="text-xs text-left">
                        {elementStyle.displayName}
                    </p>
                </div>
                <div class="w-32 ml-auto">
                    {#if elementStyle.key === "gridTemplateColumns" || elementStyle.key === "gridTemplateRows"}
                        <ColumnRowInput {elementStyle} {updateElementStyle} />
                    {:else if elementStyle.type === ElementStyleType.Select}
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
