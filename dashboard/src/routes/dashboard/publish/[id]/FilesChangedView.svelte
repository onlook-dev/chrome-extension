<script lang="ts">
	import type { FileContentData } from '$shared/models/translation';
	import { createPatch } from 'diff';
	import { html } from 'diff2html';
	import 'diff2html/bundles/css/diff2html.min.css'; // Import the CSS for diff2html
	import { ColorSchemeType } from 'diff2html/lib/types';
	import { onMount } from 'svelte';

	export let changesMap = new Map<string, FileContentData>();
	let diffHtmls: string[] = [];
	let diffRef: HTMLDivElement;

	const oldMap = new Map([
		[
			'dashboard/src/routes/dashboard/agent/+page.svelte',
			{
				path: 'dashboard/src/routes/dashboard/agent/+page.svelte',
				content: '<div>Hello world</div>',
				sha: '8cf82b20efa0b0957708aaab9ee8f42f3cd28670'
			}
		]
	]);

	const newMap = new Map([
		[
			'dashboard/src/routes/dashboard/agent/+page.svelte',
			{
				path: 'dashboard/src/routes/dashboard/agent/+page.svelte',
				content: '<div>Hello friend</div>',
				sha: '8cf82b20efa0b0957708aaab9ee8f42f3cd28670'
			}
		]
	]);

	onMount(() => {
		oldMap.forEach((value, key) => {
			const oldFile = value.content ?? '';
			const newFile = newMap.get(key)?.content ?? '';
			const diffString = createPatch(key, oldFile, newFile, '', '', { context: 0 });
			const diffHtml = html(diffString, {
				drawFileList: true,
				matching: 'lines',
				outputFormat: 'side-by-side',
				colorScheme: ColorSchemeType.DARK,
				diffStyle: 'word'
			});
			diffHtmls = [...diffHtmls, diffHtml];
		});

		setTimeout(() => {
			const elements = document.querySelectorAll('.d2h-dark-color-scheme');

			// Loop through each selected element and change its background color
			elements.forEach((element) => {
				element.style.backgroundColor = 'black';
			});
		}, 100);
	});
</script>

<div class="w-full h-full flex flex-col items-center justify-center">
	{#each diffHtmls as diff}
		<div class="w-full">
			{@html diff}
		</div>
	{/each}
	<div bind:this={diffRef}></div>
</div>
