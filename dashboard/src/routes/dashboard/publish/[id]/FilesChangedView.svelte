<script lang="ts">
	import {
		ProjectPublisher,
		type ProjectPublisherEvent,
		ProjectPublisherEventType
	} from '$lib/publish';
	import type { FileContentData } from '$shared/models/translation';
	import { createPatch } from 'diff';
	import { html } from 'diff2html';
	import 'diff2html/bundles/css/diff2html.min.css'; // Import the CSS for diff2html
	import { ColorSchemeType } from 'diff2html/lib/types';
	import { onMount } from 'svelte';

	export let projectPublisher: ProjectPublisher;

	let diffHtmls: string[] = [];
	let diffRef: HTMLDivElement;
	let beforeMap = new Map<string, FileContentData>();
	let afterMap = new Map<string, FileContentData>();

	$: if (projectPublisher) {
		projectPublisher.on(projectPublisher.EMIT_EVENT_NAME, (event: ProjectPublisherEvent) => {
			switch (event.type) {
				case ProjectPublisherEventType.TRANSLATING:
					beforeMap = projectPublisher.beforeMap;
					afterMap = projectPublisher.filesMap;
					break;
			}
		});
	}

	onMount(() => {
		if (projectPublisher) {
			beforeMap = projectPublisher.beforeMap;
			afterMap = projectPublisher.filesMap;
		}
	});

	$: {
		beforeMap.forEach((value, key) => {
			const oldFile = value.content ?? '';
			const newFile = afterMap.get(key)?.content ?? '';
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
	}
</script>

<div class="w-full h-full flex flex-col items-center justify-center overflow-auto">
	{#each diffHtmls as diff}
		<div class="w-full">
			{@html diff}
		</div>
	{/each}
	<div bind:this={diffRef}></div>
</div>
