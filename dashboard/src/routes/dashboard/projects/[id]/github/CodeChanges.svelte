<script lang="ts">
	import { createCodeChanges } from '$lib/github/github';
	import { createPatch } from 'diff';
	import { html } from 'diff2html';
	import 'diff2html/bundles/css/diff2html.min.css'; // Import the CSS for diff2html

	export let userId: string;
	export let projectId: string;
	let diffHtmls: string[] = [];

	async function createCodeChange() {
		const { oldMap, newMap } = await createCodeChanges(userId, projectId);

		oldMap.forEach((value, key) => {
			const oldFile = value.content ?? '';
			const newFile = newMap.get(key)?.content ?? '';
			const diffString = createPatch(key, oldFile, newFile, '', '', { context: 0 });
			const diffHtml = html(diffString, { drawFileList: false, matching: 'lines' });
			diffHtmls = [...diffHtmls, diffHtml];
		});
	}
</script>

<div class="w-full h-full flex flex-col items-center justify-center">
	{#each diffHtmls as diff}
		{@html diff}
	{/each}

	<button class="btn btn-primary" on:click={createCodeChange}>Create changes</button>
</div>
