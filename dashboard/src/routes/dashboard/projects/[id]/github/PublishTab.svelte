<script lang="ts">
	import { onMount } from 'svelte';
	import {
		DashboardRoutes,
		FirestoreCollections,
		MAX_DESCRIPTION_LENGTH,
		MAX_TITLE_LENGTH
	} from '$shared/constants';
	import { projectsMapStore } from '$lib/utils/store';
	import { nanoid } from 'nanoid';
	import { baseUrl } from '$lib/utils/env';
	import { toast } from '@zerodevx/svelte-toast';
	import { FirebaseService } from '$lib/storage';
	import { GithubService } from '$lib/github';

	import type { Project } from '$shared/models/project';
	import type { GithubHistory } from '$shared/models/github';
	import type { User } from '$shared/models/user';

	import GitHub from '~icons/mdi/github';
	import ConfigureProjectInstructions from './instructions/ConfigureProjectInstructions.svelte';
	import GithubHistories from './GithubHistories.svelte';

	export let project: Project;
	export let user: User;

	let githubService: GithubService;
	const projectService = new FirebaseService<Project>(FirestoreCollections.PROJECTS);
	const githubHistoryService = new FirebaseService<GithubHistory>(
		FirestoreCollections.GITHUB_HISTORY
	);

	let githubHistories: GithubHistory[] = [];
	let githubConfigured = false;
	let hasActivities = false;
	let hasFilePaths = false;
	let isLoading = false;
	let publishError = false;
	let publishErrorMessage = '';
	let errorMessage = '';
	let prLink: string | undefined;

	let titlePlaceholder = 'Updated site using Onlook';
	let descriptionPlaceholder = 'Describe your changes here';
	let title = '';
	let description = '';

	$: if (project?.installationId) {
		githubService = new GithubService(project.installationId);
		githubConfigured = true;
	}

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

		if (project?.githubHistoryIds?.length > 0) {
			Promise.all(project.githubHistoryIds.map((id) => githubHistoryService.get(id)))
				.then((histories) => {
					githubHistories = histories.filter((history) => history !== null) as GithubHistory[];
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
			prLink = await githubService.publishProjectToGitHub(project, title, description, user);
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
			githubHistoryService.post(githubHistory);
			projectService.post(project);
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
		projectService.post(project);
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

		<GithubHistories {githubHistories} {restoreActivities} />
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
