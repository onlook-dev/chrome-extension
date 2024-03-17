<script lang="ts">
	import { onMount } from 'svelte';
	import { GitHubService } from '$lib/github';
	import { DashboardRoutes, MAX_DESCRIPTION_LENGTH, MAX_TITLE_LENGTH } from '$shared/constants';
	import { postProjectToFirebase } from '$lib/storage/project';
	import { projectsMapStore } from '$lib/utils/store';
	import { nanoid } from 'nanoid';
	import { getGithubHistoriesFromFirebase, postGithubHistoryToFirebase } from '$lib/storage/github';

	import type { Project } from '$shared/models/project';
	import type { GithubHistory } from '$shared/models/github';

	import PullRequest from '~icons/ph/git-pull-request-bold';
	import GitHub from '~icons/mdi/github';
	import Restore from '~icons/ic/baseline-restore';
	import { baseUrl } from '$lib/utils/env';
	import { toast } from '@zerodevx/svelte-toast';
	import ConfigureProjectInstructions from './ConfigureProjectInstructions.svelte';
	import type { User } from '$shared/models/user';

	export let project: Project;
	export let user: User;

	let githubService: GitHubService;
	let githubHistories: GithubHistory[] = [];
	let githubConfigured = false;
	let hasActivities = false;
	let hasFilePaths = false;
	let isLoading = false;
	let publishError = false;
	let publishErrorMessage = '';
	let historyOpen = true;
	let errorMessage = '';
	let prLink: string | undefined;

	let titlePlaceholder = 'Updated site using Onlook';
	let descriptionPlaceholder = 'Describe your changes here';
	let title = '';
	let description = '';

	onMount(() => {
		// Check each activities for a path
		if (Object.keys(project.activities).length > 0) {
			hasActivities = true;
		}

		Object.values(project.activities).forEach((activity) => {
			if (activity.path) {
				hasFilePaths = true;
				return;
			}
		});

		if (project.installationId) {
			githubService = new GitHubService(project.installationId, user);
			githubConfigured = true;
		}

		if (project.githubHistoryIds?.length > 0) {
			getGithubHistoriesFromFirebase(project.githubHistoryIds)
				.then((histories) => {
					githubHistories = histories;
				})
				.catch((error) => {
					console.error('Error loading github history:', error);
				});
		}
	});

	async function handlePublishClick() {
		title = title || titlePlaceholder;
		description += `\n\n[View in onlook.dev](${baseUrl}${DashboardRoutes.PROJECTS}/${project.id})`;
		isLoading = true;
		try {
			prLink = await githubService.publishProjectToGitHub(project, title, description);
		} catch (error) {
			console.error('Error publishing changes:', error);
			publishErrorMessage = `Error publishing changes: ${JSON.stringify(error)}`;
			publishError = true;
		} finally {
			isLoading = false;
			if (!prLink) {
				publishError = true;
				return;
			}

			const githubHistory: GithubHistory = {
				id: nanoid(),
				title,
				description,
				userId: user.id,
				projectId: project.id,
				createdAt: new Date().toISOString(),
				pullRequestUrl: prLink,
				activityHistory: project.activities
			};

			// Reset activites, they are archived in github history
			title = '';
			description = '';
			if (!project.githubHistoryIds) {
				project.githubHistoryIds = [];
			}
			project.githubHistoryIds.push(githubHistory.id);
			githubHistories = [...githubHistories, githubHistory];
			toast.push('Changes published to GitHub! 🎉', {
				theme: {
					'--toastColor': 'mintcream',
					'--toastBackground': 'rgba(72,187,120,0.9)',
					'--toastBarBackground': '#2F855A'
				}
			});

			// Save project and github history
			postGithubHistoryToFirebase(githubHistory);
			postProjectToFirebase(project);
			projectsMapStore.update((projectsMap) => {
				projectsMap.set(project.id, project);
				return projectsMap;
			});
		}
	}

	function restoreActivities(history: GithubHistory) {
		if (!history.activityHistory || Object.keys(history.activityHistory).length === 0) {
			return;
		}

		project.activities = history.activityHistory;
		postProjectToFirebase(project);
		projectsMapStore.update((projectsMap) => {
			projectsMap.set(project.id, project);
			return projectsMap;
		});
		hasActivities = true;
	}

	function displayError(message: string) {
		errorMessage = message;
		setTimeout(() => {
			errorMessage = '';
		}, 10000);
	}

	$: if (publishError) {
		displayError(publishErrorMessage);
	}
</script>

<div class="flex flex-col items-center justify-center h-full mt-4">
	{#if githubConfigured && hasActivities && hasFilePaths}
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
				{#if errorMessage}
					<p class="text-xs text-error">{errorMessage}</p>
				{:else}
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
				{/if}
			</div>
		</label>

		{#if githubHistories.length > 0}
			<div
				class="collapse collapse-arrow border rounded-md mt-6 {historyOpen
					? 'collapse-open'
					: 'collapse-close'}"
			>
				<input type="checkbox" on:click={() => (historyOpen = !historyOpen)} />
				<div class="collapse-title">Publish history ({githubHistories.length})</div>
				<div class="collapse-content space-y-2">
					{#each githubHistories as history}
						<div class="flex flex-row max-w-[100%] items-center">
							<p class="line-clamp-1 text-ellipsis max-w-[70%]">
								{history.title}
							</p>
							<div class="ml-auto">
								<div class="tooltip tooltip-left" data-tip="View pull request">
									<button
										class="btn btn-xs btn-square btn-ghost ml-auto"
										on:click={() => window.open(history.pullRequestUrl, '_blank')}
										><PullRequest class="w-4 h-4" /></button
									>
								</div>
								<div class="tooltip tooltip-left" data-tip="Restore changes">
									<button
										class="btn btn-xs btn-square btn-ghost"
										on:click={() => {
											// @ts-ignore
											document.getElementById('confirm_restore_modal').showModal();
										}}><Restore class="w-4 h-4" /></button
									>
								</div>

								<dialog id="confirm_restore_modal" class="modal">
									<div class="modal-box">
										<h3 class="font-bold text-lg">Restore changes?</h3>
										<p class="py-4">This will overwrite your current activities.</p>
										<div class="modal-action">
											<form method="dialog">
												<!-- if there is a button in form, it will close the modal -->
												<button class="btn">Cancel</button>
												<button
													class="btn btn-error ml-2"
													on:click={() => restoreActivities(history)}>Restore</button
												>
											</form>
										</div>
									</div>
								</dialog>
							</div>
						</div>
					{/each}
				</div>
			</div>
		{/if}
	{:else if !githubConfigured}
		<p class="text-center text-lg">No github config found</p>
	{:else if hasActivities && !hasFilePaths}
		<p class="text-center text-lg">Edited website not configured with Onlook</p>
		<p class="text-center text-lg">Instructions for configuring website with Onlook below</p>
		<ConfigureProjectInstructions />
	{:else}
		<p class="text-center text-lg">Nothing to publish</p>
		<p class="text-center text-lg">Use the extension to make some edits!</p>
	{/if}
</div>
