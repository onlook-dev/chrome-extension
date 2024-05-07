<script lang="ts">
	import { onMount } from 'svelte';
	import {
		DashboardRoutes,
		FirestoreCollections,
		MAX_DESCRIPTION_LENGTH,
		MAX_TITLE_LENGTH
	} from '$shared/constants';
	import {
		ProjectPublisher,
		ProjectPublisherEventType,
		type ProjectPublisherEvent
	} from '$lib/publish';
	import { projectsMapStore } from '$lib/utils/store';
	import { nanoid } from 'nanoid';
	import { baseUrl } from '$lib/utils/env';
	import { toast } from '@zerodevx/svelte-toast';
	import { FirebaseService } from '$lib/storage';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Switch } from '$lib/components/ui/switch/index.js';
	import { Textarea } from '$lib/components/ui/textarea';

	import GitHub from '~icons/mdi/github';
	import HistoriesView from './HistoriesView.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Collapsible from '$lib/components/ui/collapsible';
	import * as Tabs from '$lib/components/ui/tabs/index.js';

	import type { Project, GithubHistory, User } from '$shared/models';

	export let project: Project;
	export let user: User;

	let projectPublisher: ProjectPublisher;
	const projectService = new FirebaseService<Project>(FirestoreCollections.PROJECTS);
	const githubHistoryService = new FirebaseService<GithubHistory>(
		FirestoreCollections.GITHUB_HISTORY
	);

	let githubHistories: GithubHistory[] = [];
	let publishErrorMessage = '';

	let titlePlaceholder = 'Updated site using Onlook';
	let descriptionPlaceholder = 'Describe your changes here';
	let title = '';
	let description = '';

	// States
	let githubConfigured = false;
	let hasActivities = false;
	let hasFilePaths = false;
	let publishError = false;
	let isLoading = false;
	let isTranslating = false;
	let translationProgress = 0;
	let translationTotal = 0;
	let forceTailwind = false;

	$: if (project?.installationId) {
		githubConfigured = true;
	}

	$: if (projectPublisher) {
		projectPublisher.toggleForceTailwind(forceTailwind);
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
		publishErrorMessage = '';
		publishError = false;
		try {
			projectPublisher = new ProjectPublisher(project, user);
			handleProjectPublisherEvents(projectPublisher);
			let pullRequestUrl = await projectPublisher.publish(title, description);
			if (!pullRequestUrl) throw new Error('No pull request url returned from GitHub');
			handlePublishedSucceeded(pullRequestUrl);
		} catch (error) {
			console.error('Error publishing changes:', error);
			publishErrorMessage = `Error publishing changes: ${JSON.stringify(error)}`;
			publishError = true;
		} finally {
			isLoading = false;
			isTranslating = false;
		}
	}

	function handleProjectPublisherEvents(projectPublisher: ProjectPublisher) {
		projectPublisher.on(projectPublisher.EMIT_EVENT_NAME, (event: ProjectPublisherEvent) => {
			switch (event.type) {
				case ProjectPublisherEventType.TRANSLATING:
					translationProgress = event.progress?.processed || 0;
					translationTotal = event.progress?.total || 0;
					isLoading = true;
					isTranslating = true;
					break;
				case ProjectPublisherEventType.PUBLISHING:
					isLoading = true;
					break;
				default:
					break;
			}
		});
	}

	function handlePublishedSucceeded(pullRequestUrl: string) {
		const githubHistory: GithubHistory = {
			id: nanoid(),
			title,
			description,
			userId: user.id,
			projectId: project.id,
			createdAt: new Date().toISOString(),
			pullRequestUrl,
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

	$: if (publishError) {
		setTimeout(() => {
			publishError = false;
		}, 10000);
	}
</script>

<div class="flex flex-col items-center justify-center h-full mt-4 space-y-4">
	<Tabs.Root value="main" class="w-full">
		<Tabs.List class="">
			<Tabs.Trigger value="main">General</Tabs.Trigger>
			<Tabs.Trigger value="code">File changed</Tabs.Trigger>
		</Tabs.List>
		<Tabs.Content value="main">
			<label class="form-control w-full p-2 space-y-4">
				<Label for="form-title">Title</Label>

				<Input
					id="form-title"
					disabled={!hasActivities || isLoading}
					bind:value={title}
					type="text"
					placeholder={titlePlaceholder}
					class="w-full text-sm"
					maxlength={MAX_TITLE_LENGTH}
				/>

				<Label for="form-description">Description</Label>

				<Textarea
					id="form-tidescriptiontle"
					disabled={!hasActivities || isLoading}
					bind:value={description}
					class="h-24"
					placeholder={descriptionPlaceholder}
					maxlength={MAX_DESCRIPTION_LENGTH}
				></Textarea>
				<div class="mt-6 flex items-center justify-end">
					{#if !publishError}
						{#if isTranslating}
							<div class="flex flex-col mr-8 flex-grow space-y-2 text-sm">
								<progress
									class="progress progress-success w-2/3"
									value={translationProgress}
									max={translationTotal}
								></progress>
								<p>{translationProgress}/{translationTotal} changes translated</p>
							</div>
						{/if}
						<Button
							variant="primary"
							disabled={!hasActivities || isLoading || isTranslating}
							on:click={handlePublishClick}
						>
							{#if isLoading}
								<div class="loading mr-2"></div>
								Publishing
							{:else}
								<GitHub class="w-5 h-5 mr-2" /> Publish
							{/if}
						</Button>
					{/if}
				</div>
				{#if publishErrorMessage}
					<p class="text-xs text-error mt-4">{publishErrorMessage}</p>
				{/if}
			</label>

			<HistoriesView {githubHistories} {restoreActivities} />

			<Collapsible.Root class="border rounded w-full p-2 text-sm">
				<Collapsible.Trigger class="hover:opacity-90 w-full text-start"
					>Optional Configurations</Collapsible.Trigger
				>
				<Collapsible.Content class="mt-4">
					<div class="flex flex-row">
						<Label for="force-tailwind">Force TailwindCSS</Label>
						<Switch id="force-tailwind" class="toggle ml-auto" bind:checked={forceTailwind} />
					</div>
				</Collapsible.Content>
			</Collapsible.Root>
		</Tabs.Content>
		<Tabs.Content value="code"></Tabs.Content>
	</Tabs.Root>
</div>
