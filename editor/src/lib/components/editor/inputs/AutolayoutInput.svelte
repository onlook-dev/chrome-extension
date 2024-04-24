<script lang="ts">
    import { appendCssUnit } from "$lib/tools/edit/units";
    import {
        AutoLayout,
        LayoutMode,
        LayoutProperty,
    } from "$lib/tools/selection/autolayout";
    import { NumberUnit } from "$lib/tools/selection/numberUnit";
    import type { ElementStyle } from "$lib/tools/selection/styles";
    import { ChevronDown } from "radix-icons-svelte";

    export let el: HTMLElement;
    export let elementStyle: ElementStyle;
    export let updateElementStyle: (key: string, value: string) => void;
    export let inputWidth: string = "w-16";

    let autoLayout: AutoLayout = new AutoLayout();
    let numberUnit = new NumberUnit();
    let value: string = elementStyle.value;
    let mode: LayoutMode = LayoutMode.Fixed;

    $: if (elementStyle) {
        const res = autoLayout.getInputValues(elementStyle.value);
        value = res.value;
        mode = res.mode;
    }

    const optionMap = {
        Fit: "Hug",
        Relative: "Rel",
    };
</script>

{#if elementStyle}
    <div class="flex flex-row gap-1 justify-end">
        <!-- Show fit-content as empty because it's cooler -->
        <input
            value={value === "fit-content" ? "" : value}
            type="text"
            class="{inputWidth} rounded-sm p-1 px-2 text-xs border-none text-text bg-surface text-start focus:outline-none focus:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            placeholder="--"
            on:input={(e) => {
                const res = autoLayout.getInputValues(e.currentTarget.value);
                value = res.value;
                mode = res.mode;
                updateElementStyle(elementStyle.key, appendCssUnit(res.value));
            }}
            on:blur={() => (value = appendCssUnit(value))}
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
        <div class="relative w-16">
            <select
                name={elementStyle.displayName}
                value={mode}
                placeholder="auto"
                class="p-[6px] w-full px-2 text-start rounded border-none text-xs text-text bg-surface appearance-none focus:outline-none focus:ring-0 capitalize"
                on:change={(e) => {
                    const res = autoLayout.getStyles(
                        LayoutProperty[elementStyle.key],
                        LayoutMode[e.currentTarget.value],
                        value,
                        el,
                    );
                    mode = LayoutMode[e.currentTarget.value];
                    value = res[elementStyle.key];
                    updateElementStyle(elementStyle.key, res[elementStyle.key]);
                }}
            >
                {#each elementStyle.units ?? [] as option}
                    <option class="bg-red" value={option}
                        >{optionMap[option]
                            ? optionMap[option]
                            : option}</option
                    >
                {/each}
            </select>

            <div
                class="text-tertiary absolute inset-y-0 right-0 flex items-center pr-1 pointer-events-none"
            >
                <ChevronDown />
            </div>
        </div>
    </div>
{/if}
