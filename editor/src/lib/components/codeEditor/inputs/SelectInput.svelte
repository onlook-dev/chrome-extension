<script lang="ts">
	import type { ElementStyle } from "$lib/tools/selection/styles";

	export let elementStyle: ElementStyle;
	export let updateElementStyle: (key: string, value: string) => void;
</script>

{#if elementStyle}
	<select
		name={elementStyle.displayName}
		class="border border-border rounded-lg p-2 text-text bg-background w-52"
		on:input={(event) => {
			updateElementStyle(elementStyle.key, event.target.value);
		}}
	>
		{#each elementStyle.options ?? [] as option}
			<option value={option}>{option}</option>
		{/each}
	</select>
{/if}
