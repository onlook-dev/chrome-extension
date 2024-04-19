<script lang="ts">
    import type { ElementStyle } from "$lib/tools/selection/styles";

    export let elementStyle: ElementStyle;
    export let updateElementStyle: (key: string, value: string) => void;
    export let unitEnd: boolean = false;
    export let inputWidth: string = "w-16";
    export let unitWidth: string = "w-16";
</script>

{#if elementStyle}
    <div class="flex flex-row gap-1 justify-end">
        <input
            type="text"
            class="{inputWidth} rounded-sm p-1 px-2 text-xs border-none text-text bg-surface text-start focus:outline-none focus:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            placeholder="--"
        />

        <select
            name={elementStyle.displayName}
            placeholder="auto"
            class="text-xs {unitWidth} rounded-sm p-1 px-2 border-none text-text bg-surface {unitEnd
                ? 'text-end'
                : 'text-start'} focus:outline-none focus:ring-0"
        >
            <option>None</option>
            {#each elementStyle.units ?? [] as option}
                <option value={option}>{option}</option>
            {/each}
        </select>
    </div>
{/if}
