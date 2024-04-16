<script lang="ts">
	import { ImageComparison } from '$lib/components/ui/image-compare';
	import { EyeNone } from 'svelte-radix';
	import { panzoom, type Options } from 'svelte-pan-zoom';
	import { onMount } from 'svelte';

	export let beforeImage: string | undefined;
	export let afterImage: string | undefined;

	let canvas: HTMLCanvasElement;
	let cx: CanvasRenderingContext2D;
	let left: HTMLImageElement;
	let right: HTMLImageElement;
	let options: Options = {
		width: 1920,
		height: 1080,
		render
	};

	$: beforeImage, updateImages();
	$: afterImage, updateImages();

	async function updateImages() {
		[left, right] = await Promise.all([loadImage(beforeImage ?? ''), loadImage(afterImage ?? '')]);
		cx = canvas.getContext('2d')!;
		options = {
			width: left.width,
			height: left.height,
			render
		};
	}

	function render(ctx: CanvasRenderingContext2D) {
		if (!left) return;
		ctx.drawImage(left, 0, 0);

		console.log(ctx.getTransform());

		cx.save();
		cx.resetTransform();
		canvas.width = ctx.canvas.width;
		canvas.height = ctx.canvas.height;
		cx.setTransform(ctx.getTransform());
		cx.drawImage(right, 0, 0);
		cx.restore();
	}

	function loadImage(src: string) {
		return new Promise<HTMLImageElement>((resolve) => {
			const image = new Image();

			image.onload = () => resolve(image);
			image.src = src;
		});
	}

	onMount(async () => {
		[left, right] = await Promise.all([loadImage(beforeImage ?? ''), loadImage(afterImage ?? '')]);
		cx = canvas.getContext('2d')!;
		options = {
			width: left.width,
			height: left.height,
			render
		};
	});
</script>

{#if beforeImage && afterImage}
	<ImageComparison class="w-full h-full">
		<canvas use:panzoom={options} slot="left" />
		<canvas bind:this={canvas} slot="right" id="right" />
	</ImageComparison>
{:else if beforeImage || afterImage}
	<div class="w-full h-full max-w-[80%] max-h-[80%]">
		<img class="object-scale-down" src={beforeImage ?? afterImage} alt="Screenshot" />
	</div>
{:else}
	<div class="flex flex-row items-center">
		<EyeNone class="mr-2" />
		<p>No images to compare</p>
	</div>
{/if}

<style>
	canvas {
		box-sizing: border-box;
		width: 100%;
		height: 100%;
		user-select: none;
		touch-action: none;
		overscroll-behavior: none;
		-webkit-user-select: none; /* disable selection/Copy of UIWebView */
		-webkit-touch-callout: none; /* disable the IOS popup when long-press on a link */
	}

	#right {
		pointer-events: none;
	}
</style>
