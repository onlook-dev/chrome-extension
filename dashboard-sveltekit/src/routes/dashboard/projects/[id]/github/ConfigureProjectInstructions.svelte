<script lang="ts">
	import type { Project } from '$shared/models/project';
	import NextjsCodeblock from './NextjsCodeblock.svelte';
	import SvelteCodeblock from './SvelteCodeblock.svelte';

	export let project: Project;
</script>

<p class="text-md text-center">
	<b>{new URL(project.hostUrl).host}</b> is not configured with Onlook. <br />Follow instructions
	below.
</p>

<div class="text-start max-w-[100%] space-y-4 my-4">
	<div>
		<p class="mt-3 font-semibold">1. Install the onlook library:</p>
		<div role="tablist" class="tabs tabs-bordered">
			<input type="radio" name="my_tabs_2" role="tab" class="tab" aria-label="Next.js" checked />
			<div role="tabpanel" class="tab-content bg-base-100 rounded-box py-4 overflow-auto">
				<NextjsCodeblock />
			</div>
			<input type="radio" name="my_tabs_2" role="tab" class="tab" aria-label="Svelte" />
			<div role="tabpanel" class="tab-content bg-base-100 rounded-box py-4 overflow-auto">
				<SvelteCodeblock />
			</div>
		</div>
		<p class="">This will add a secure onlook identifier in your app.</p>
	</div>

	<div>
		<p class="font-semibold py-2">2. Publish project:</p>
		<p class="">Run your project in localhost or publish it.</p>
	</div>
	<div>
		<p class="font-semibold py-2">3. Sync your project:</p>
		<p class="">Open project in Chrome extension and press edit.</p>
	</div>
</div>
