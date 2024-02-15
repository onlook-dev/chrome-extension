<script lang="ts">
	import Color from "colorjs.io";
	import type { ElementStyle } from "$lib/tools/selection/styles";
	import { Button } from "$lib/components/ui/button";

	export let elementStyle: ElementStyle;
	export let updateElementStyle: (key: string, value: string) => void;
	let inputString: string = "";
	$: inputString = elementStyle.value;
</script>

<div class="w-52 h-9.5">
	{#if inputString && inputString !== ""}
		<div
			class="border border-border space-x-2 flex flex-row p-1 items-center rounded-lg cursor-pointer"
		>
			<input
				type="color"
				class="h-6 w-5 bg-background block p-0 m-0 cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
				value={inputString}
				on:input={(event) => {
					inputString = new Color(event.target.value).toString({ format: "hex" });
					updateElementStyle(elementStyle.key, inputString);
				}}
				title="Choose your color"
			/>

			<input
				class="border-none h-8 text-xs bg-transparent cursor-pointer border-transparent focus:border-transparent focus:outline-transparent focus:ring-transparent focus:ring-0"
				type="text"
				value={inputString}
				on:input={(event) => {
					inputString = new Color(event.target.value).toString({ format: "hex" });
					updateElementStyle(elementStyle.key, inputString);
				}}
			/>
		</div>
	{:else}
		<Button
			class="w-full h-full"
			variant="outline"
			on:click={() => {
				inputString = "#0000";
				console.log("inputString", inputString);
			}}>+ Add color</Button
		>
	{/if}
</div>
