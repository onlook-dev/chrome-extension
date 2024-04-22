<script lang="ts">
    import { AutoLayout } from "$lib/tools/selection/autolayout";
    import { NumberUnit } from "$lib/tools/selection/numberUnit";
    import type { ElementStyle } from "$lib/tools/selection/styles";

    export let elementStyle: ElementStyle;
    export let updateElementStyle = (key: string, value: string) => {};
    export let inputWidth = "w-full";
    let numberUnit = new NumberUnit();
    let autoLayout = new AutoLayout();
    $: value = autoLayout.getRowColumnCount(elementStyle.value).toString();

    const updatedUpdateElementStyle = (key: string, value: string) => {
        const updatedValue = autoLayout.generateRowColumnTemplate(value);
        updateElementStyle(key, updatedValue);
    };
</script>

<input
    type="text"
    class="{inputWidth} p-[6px] text-xs px-2 rounded border-none text-text bg-surface text-start focus:outline-none focus:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
    placeholder="--"
    {value}
    on:input={(e) => {
        updatedUpdateElementStyle(elementStyle.key, e.currentTarget.value);
    }}
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
        updatedUpdateElementStyle(elementStyle.key, stringValue);
    }}
/>
