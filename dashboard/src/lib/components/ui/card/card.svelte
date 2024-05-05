<script lang="ts">
	import type { HTMLAttributes } from "svelte/elements";
	import { cn } from "$lib/utils.js";

	type $$Props = HTMLAttributes<HTMLDivElement>;

	let className: $$Props["class"] = undefined;
	export { className as class };
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
	class={cn("rounded-xl border bg-card text-card-foreground shadow", className)}
	style="width: 50%; border-color: #c7c7c7; height: fit-content; border-width: 0px;"
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
