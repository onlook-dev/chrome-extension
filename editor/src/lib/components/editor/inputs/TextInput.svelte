<script lang="ts">
    import { appendCssUnit } from "$lib/tools/edit/units";
    import { NumberUnit } from "$lib/tools/selection/numberUnit";
    import type { ElementStyle } from "$lib/tools/selection/styles";

    export let elementStyle: ElementStyle;
    export let updateElementStyle = (
        key: string,
        value: string,
        refresh?: boolean,
    ) => {};
    export let inputWidth = "w-full";

    $: value = elementStyle.value;
    let numberUnit = new NumberUnit();
    let localValue = elementStyle.value;
    let isFocused = false; // Add focus state tracking

    $: if (!isFocused) {
        localValue = elementStyle.value;
    }
</script>

<input
    type="text"
    class="{inputWidth} p-[6px] text-xs px-2 rounded border-none text-text bg-surface text-start focus:outline-none focus:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
    placeholder="--"
    bind:value={localValue}
    on:input={(e) => {
        elementStyle.value = e.currentTarget.value;
        updateElementStyle(
            elementStyle.key,
            appendCssUnit(e.currentTarget.value),
        );
    }}
    on:focus={() => (isFocused = true)}
    on:blur={() => (isFocused = false)}
    on:keydown={(e) => {
        let step = 1;
        if (e.key === "Enter") {
            e.currentTarget.blur();
            return;
        }
        if (e.shiftKey) step = 10;

        let [parsedNumber, parsedUnit] = numberUnit.stringToParsedValue(
            e.currentTarget.value,
        );

        if (e.key === "ArrowUp") {
            parsedNumber += step;
            e.preventDefault();
        } else if (e.key === "ArrowDown") {
            parsedNumber -= step;
            e.preventDefault();
        }

        const stringValue = numberUnit.parsedValueToString(
            parsedNumber,
            parsedUnit,
        );
        value = stringValue;
        localValue = stringValue;
        elementStyle.value = stringValue;
        updateElementStyle(elementStyle.key, stringValue);
    }}
/>
