<script lang="ts">
	import { onMount } from 'svelte';
	import { exportToPRComments } from '$lib/github/github';
	import ConfigureProjectInstructions from './ConfigureProjectInstructions.svelte';
	import { MAX_DESCRIPTION_LENGTH, MAX_TITLE_LENGTH } from '$shared/constants';

	import type { Project } from '$shared/models/project';
	import type { GithubHistory } from '$shared/models/github';
	import { postProjectToFirebase } from '$lib/storage/project';
	import { projectsMapStore } from '$lib/utils/store';

	import OpenLink from '~icons/gridicons/external';
	import GitHub from '~icons/mdi/github';
	import { nanoid } from 'nanoid';
	import { getGithubHistoriesFromFirebase, postGithubHistoryToFirebase } from '$lib/storage/github';

	export let project: Project;
	export let userId: string;

	let githubHistory: GithubHistory[] = [];

	let githubConfigured = false;
	let hasActivities = false;
	let loadingRepos = false;
	let isLoading = false;
	let prLink: string | undefined;

	let titlePlaceholder = 'Design QA with onlook.dev';
	let descriptionPlaceholder = 'Made UI adjustments using the onlook platform';
	let title = '';
	let description = '';

	onMount(() => {
		if (project?.activities && Object.keys(project.activities).length > 0) {
			hasActivities = true;
		}

		Object.values(project.activities).forEach((activity) => {
			console.log('activity', activity.path);
			if (activity.path) {
				// If a path is found, open the modal
				githubConfigured = true;
				return;
			}
		});

		if (project?.githubHistoryIds?.length > 0) {
			githubConfigured = true;
			loadingRepos = true;
			getGithubHistoriesFromFirebase(project.githubHistoryIds)
				.then((histories) => {
					githubHistory = histories;
				})
				.then(() => {
					loadingRepos = false;
				})
				.catch((error) => {
					console.error('Error loading github history:', error);
				});
		}
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

			const githubHistory: GithubHistory = {
				id: nanoid(),
				title,
				description,
				userId,
				projectId: project.id,
				createdAt: new Date().toISOString(),
				pullRequestUrl: prLink,
				activityHistory: project.activities
			};

			// Reset activites, they are archived in github history
			project.activities = {};
			project.githubHistoryIds.push(githubHistory.id);

			// Save project and github history
			postGithubHistoryToFirebase(githubHistory);
			postProjectToFirebase(project);
			projectsMapStore.update((projectsMap) => {
				projectsMap.set(project.id, project);
				return projectsMap;
			});
		}
	}
</script>

<div class="flex flex-col items-center justify-center h-full mt-4">
	{#if githubConfigured}
		<label class="form-control w-full p-2">
			<div class="label">
				<span class="label-text">Title</span>
			</div>
			<input
				disabled={!hasActivities || isLoading}
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
				disabled={!hasActivities || isLoading}
				bind:value={description}
				class="textarea textarea-bordered h-24"
				placeholder={descriptionPlaceholder}
				maxlength={MAX_DESCRIPTION_LENGTH}
			></textarea>
			<div class="mt-6 ml-auto">
				<button
					class="btn btn-primary"
					disabled={!hasActivities || isLoading}
					on:click={handlePublishClick}
				>
					{#if isLoading}
						<div class="loading"></div>
						Publishing
					{:else}
						<GitHub class="w-5 h-5" /> Publish
					{/if}
				</button>
			</div>
		</label>

		{#if project.githubHistoryIds.length > 0}
			<div class="collapse collapse-arrow border rounded-md mt-6">
				<input type="checkbox" />
				<div class="collapse-title">Publish history ({githubHistory.length})</div>
				<div class="collapse-content space-y-2">
					{#each githubHistory as history}
						<div class="flex flex-row max-w-[100%]">
							<p class="line-clamp-1 text-ellipsis max-w-[70%]">
								{history.title}
							</p>
							<a class="link font-semibold ml-auto" href={history.pullRequestUrl} target="_blank"
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
