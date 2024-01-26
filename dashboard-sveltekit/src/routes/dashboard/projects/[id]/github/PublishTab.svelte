<script lang="ts">
	import { onMount } from 'svelte';
	import { exportToPRComments } from '$lib/github/github';
	import ConfigureProjectInstructions from './ConfigureProjectInstructions.svelte';
	import { MAX_DESCRIPTION_LENGTH, MAX_TITLE_LENGTH } from '$shared/constants';

	import type { Project } from '$shared/models/project';
	import type { GithubPublish } from '$shared/models/github';
	import { postProjectToFirebase } from '$lib/storage/project';
	import { projectsMapStore } from '$lib/utils/store';

	import OpenLink from '~icons/gridicons/external';
	import GitHub from '~icons/mdi/github';

	export let project: Project;
	export let userId: string;

	let isLoading = false;
	let prLink: string | undefined;
	let pathFound = false;

	let titlePlaceholder = 'Design QA with onlook.dev';
	let descriptionPlaceholder = 'Made UI adjustments using the onlook platform';
	let title = '';
	let description = '';

	onMount(() => {
		// Check each activities for a path

		Object.values(project.activities).forEach((activity) => {
			console.log('activity', activity.path);
			if (activity.path) {
				// If a path is found, open the modal
				pathFound = true;
				return;
			}
		});
	});

	async function handlePublishClick() {
		title = title || titlePlaceholder;
		description = description || descriptionPlaceholder;
		isLoading = true;
		try {
			prLink = await exportToPRComments(userId, project?.id);
		} catch (error) {
			console.error('Error publishing changes:', error);
			alert(`Error publishing changes. ${error}`);
		} finally {
			isLoading = false;
			if (!prLink) {
				return;
			}

			// Add to history
			project.githubHistory = [
				...(project.githubHistory || []),
				{
					title,
					description,
					createdAt: new Date().toISOString(),
					userId,
					projectId: project.id,
					pullRequestUrl: prLink
				} as GithubPublish
			];

			// Save project
			postProjectToFirebase(project);
			projectsMapStore.update((projectsMap) => {
				projectsMap.set(project.id, project);
				return projectsMap;
			});
		}
	}
</script>

<div class="flex flex-col items-center justify-center h-full mt-4">
	{#if pathFound}
		<label class="form-control w-full p-2">
			<div class="label">
				<span class="label-text">Title</span>
			</div>
			<input
				disabled={isLoading}
				bind:value={title}
				type="text"
				placeholder={titlePlaceholder}
				class="input input-bordered w-full text-sm"
				maxlength={MAX_TITLE_LENGTH}
			/>
			<div class="label">
				<span class="label-text">Description</span>
			</div>
			<textarea
				disabled={isLoading}
				bind:value={description}
				class="textarea textarea-bordered h-24"
				placeholder={descriptionPlaceholder}
				maxlength={MAX_DESCRIPTION_LENGTH}
			></textarea>
			<div class="mt-6 ml-auto">
				<button class="btn btn-primary" on:click={handlePublishClick}>
					{#if isLoading}
						<div class="loading"></div>
						Publishing
					{:else}
						<GitHub class="w-5 h-5" /> Publish
					{/if}
				</button>
			</div>
		</label>

		{#if project.githubHistory && project.githubHistory.length > 0}
			<div class="collapse collapse-arrow border rounded-md mt-6">
				<input type="checkbox" />
				<div class="collapse-title">Publish history ({project.githubHistory.length})</div>
				<div class="collapse-content space-y-2">
					{#each project.githubHistory as githubPublish}
						<div class="flex flex-row max-w-[100%]">
							<p class="line-clamp-1 text-ellipsis max-w-[70%]">
								{githubPublish.title}
							</p>
							<a
								class="link font-semibold ml-auto"
								href={githubPublish.pullRequestUrl}
								target="_blank"
								>Pull request <OpenLink class="inline-block w-4 h-4" />
							</a>
						</div>
					{/each}
				</div>
			</div>
		{/if}
	{:else}
		<ConfigureProjectInstructions {project} />
	{/if}
</div>
