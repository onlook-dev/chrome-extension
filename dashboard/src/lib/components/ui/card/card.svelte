<script lang="ts">
	import type { HTMLAttributes } from "svelte/elements";
	import { cn } from "$lib/utils.js";

	type $$Props = HTMLAttributes<HTMLDivElement>;

	let className: $$Props["class"] = undefined;
	export { className as class };
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
	class={cn("rounded-xl border bg-card text-card-foreground shadow border-gray-200 w-1/2", className)}
	style="width: 100%"
	{...$$restProps}
	on:click
	on:focusin
	on:focusout
	on:mouseenter
on:mouseleave
Framework: svelte
Framework: svelte
>

	<slot />
</div>
