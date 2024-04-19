<script lang="ts">
    import type { ElementStyle } from "$lib/tools/selection/styles";

    export let elementStyle: ElementStyle;
    export let updateElementStyle = (key: string, value: string) => {};
    export let inputWidth = "w-full";
</script>

<input
    type="text"
    class="{inputWidth} p-[6px] text-xs px-2 rounded border-none text-text bg-surface text-start focus:outline-none focus:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
    placeholder="--"
    value={elementStyle.value}
    on:input={(event) => {
        updateElementStyle(elementStyle.key, event.currentTarget.value);
    }}
/>
