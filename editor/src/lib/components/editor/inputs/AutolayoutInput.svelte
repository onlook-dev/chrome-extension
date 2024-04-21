<script lang="ts">
    import {
        AutoLayout,
        LayoutMode,
        LayoutProperty,
    } from "$lib/tools/selection/autolayout";
    import { NumberUnit } from "$lib/tools/selection/numberUnit";
    import type { ElementStyle } from "$lib/tools/selection/styles";

    export let el: HTMLElement;
    export let elementStyle: ElementStyle;
    export let updateElementStyle: (key: string, value: string) => void;
    export let unitEnd: boolean = false;
    export let inputWidth: string = "w-16";
    export let unitWidth: string = "w-16";

    let autoLayout: AutoLayout = new AutoLayout();
    let numberUnit = new NumberUnit();
    let value: string = elementStyle.value;
    let mode: LayoutMode = LayoutMode.Fixed;

    $: if (elementStyle) {
        const res = autoLayout.getInputValues(elementStyle.value);
        value = res.value;
        mode = res.mode;
    }
</script>

{#if elementStyle}
    <div class="flex flex-row gap-1 justify-end">
        <input
            {value}
            type="text"
            class="{inputWidth} rounded-sm p-1 px-2 text-xs border-none text-text bg-surface text-start focus:outline-none focus:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            placeholder="--"
            on:input={(e) => {
                const res = autoLayout.getInputValues(e.currentTarget.value);
                value = res.value;
                mode = res.mode;
                updateElementStyle(elementStyle.key, e.currentTarget.value);
            }}
            on:keydown={(e) => {
                let step = 1;
                if (e.key === "Enter") {
                    e.currentTarget.blur();
                    return;
                }
                if (e.shiftKey) step = 10;

                let [parsedNumber, parsedUnit] =
                    numberUnit.stringToParsedValue(value);

                if (e.key === "ArrowUp") {
                    if (mode === LayoutMode.Fit) return;
                    parsedNumber += step;
                    e.preventDefault();
                } else if (e.key === "ArrowDown") {
                    if (mode === LayoutMode.Fit) return;
                    parsedNumber -= step;
                    e.preventDefault();
                }

                const stringValue = numberUnit.parsedValueToString(
                    parsedNumber,
                    parsedUnit,
                );
                const res = autoLayout.getInputValues(stringValue);
                value = res.value;
                mode = res.mode;
                updateElementStyle(elementStyle.key, stringValue);
            }}
        />

        <select
            name={elementStyle.displayName}
            value={mode}
            placeholder="auto"
            class="text-xs {unitWidth} rounded-sm p-1 px-2 border-none text-text bg-surface {unitEnd
                ? 'text-end'
                : 'text-start'} focus:outline-none focus:ring-0"
            on:change={(e) => {
                const res = autoLayout.getStyles(
                    LayoutProperty[elementStyle.key],
                    LayoutMode[e.currentTarget.value],
                    value,
                    el,
                );
                mode = LayoutMode[e.currentTarget.value];
                value = res.displayVal;
                updateElementStyle(elementStyle.key, res[elementStyle.key]);
            }}
        >
            {#each elementStyle.units ?? [] as option}
                <option value={option}>{option}</option>
            {/each}
        </select>
    </div>
{/if}
