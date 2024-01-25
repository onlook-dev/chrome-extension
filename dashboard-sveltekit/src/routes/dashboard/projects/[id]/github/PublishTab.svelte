<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { exportToPRComments } from '$lib/github/github';
	import { DashboardRoutes } from '$shared/constants';
	import type { Project } from '$shared/models/project';
	import SvelteCodeblock from './SvelteCodeblock.svelte';
	import NextjsCodeblock from './NextjsCodeblock.svelte';

	export let project: Project;
	export let userId: string;

	let isLoading = false;
	let prLink: string | undefined;

	async function handlePublishClick() {
		if (!project?.githubSettings) {
			goto(`${DashboardRoutes.PROJECTS}/${project?.id}${DashboardRoutes.GITHUB}`);
			return;
		}

		isLoading = true;

		try {
			prLink = await exportToPRComments(userId, project?.id);
		} catch (error) {
			console.error('Error publishing changes:', error);
			// TODO: handle error
		} finally {
			isLoading = false;
		}
	}
</script>

<div class="flex flex-col items-center justify-center h-full mt-4">
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
			<p class="">Run your project in localhost or publish it again.</p>
		</div>
		<div>
			<p class="font-semibold py-2">3. Sync your project:</p>
			<p class="">Open project in Chrome extension and press sync.</p>
			<p class="">Example.jpg</p>
		</div>
	</div>
</div>

<!-- 
{#if isLoading}
	<button disabled class="btn btn-outline"> Loading... </button>
{:else if prLink}
	<a href={prLink} target="_blank" class="btn btn-outline">
		<GitHub class="w-5 h-5" />
		View changes in Github
	</a>
{:else}
	<button class="btn btn-outline" on:click={handlePublishClick}>
		<GitHub class="w-5 h-5" />
		Publish changes to Github
	</button>
{/if} -->
