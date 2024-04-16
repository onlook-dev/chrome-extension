<script lang="ts">
	import type { HTMLOlAttributes } from 'svelte/elements';
	import { cn } from '$lib/utils.js';

	type $$Props = HTMLOlAttributes & {
		el?: HTMLOListElement;
	};

	export let el: $$Props['el'] = undefined;
	let className: $$Props['class'] = undefined;
	export { className as class };
</script>

<ol
	bind:this={el}
	class={cn('flex flex-wrap items-center  break-words text-sm text-muted-foreground ', className)}
	{...$$restProps}
>
	<slot />
</ol>
