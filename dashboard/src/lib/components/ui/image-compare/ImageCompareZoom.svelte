<script lang="ts">
	import ImageComparison from './ImageComparison.svelte';
	import { EyeNone } from 'svelte-radix';
	import { panzoom, type Options } from 'svelte-pan-zoom';
	import { onMount } from 'svelte';

	export let beforeImage: string | undefined;
	export let afterImage: string | undefined;
	export let canvasClass: string = '';

	let padding = 50;
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
		[left, right] = await Promise.all([
			loadImage(beforeImage ?? afterImage ?? ''),
			loadImage(afterImage ?? beforeImage ?? '')
		]);
		cx = canvas.getContext('2d')!;
		options = {
			width: Math.max(left.width, right.width) + padding * 2,
			height: Math.max(left.height, right.height) + padding * 2,
			render
		};
	}

	function render(ctx: CanvasRenderingContext2D) {
		if (!left) return;
		ctx.drawImage(left, padding, padding);

		cx.save();
		cx.resetTransform();
		canvas.width = ctx.canvas.width;
		canvas.height = ctx.canvas.height;
		cx.setTransform(ctx.getTransform());
		cx.drawImage(right, padding, padding);
		cx.restore();
	}

	function loadImage(src: string) {
		return new Promise<HTMLImageElement>((resolve) => {
			const image = new Image();

			image.onload = () => resolve(image);
			image.src = src;
		});
	}

	onMount(updateImages);
</script>

{#if beforeImage || afterImage}
	<ImageComparison class="w-full h-full border-[#851414]">
		<canvas class={canvasClass} use:panzoom={options} slot="left" />
		<canvas class={canvasClass} bind:this={canvas} slot="right" id="right" />
	</ImageComparison>
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
