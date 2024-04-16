<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '$lib/utils.js';
	import type { HeadingLevel } from './index.js';

	type $$Props = HTMLAttributes<HTMLHeadingElement> & {
		tag?: HeadingLevel;
	};

	let className: $$Props['class'] = undefined;
	export let tag: $$Props['tag'] = 'h3';
	export { className as class };
</script>

<svelte:element
	this={tag}
	class={cn('text-sm leading-5 line font-semibold  tracking-tight', className)}
	{...$$restProps}
>
	<slot />
</svelte:element>
