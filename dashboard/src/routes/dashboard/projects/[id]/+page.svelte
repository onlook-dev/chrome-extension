<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { auth } from '$lib/firebase';
	import { trackMixpanelEvent } from '$lib/mixpanel/client';
	import { FirebaseService } from '$lib/storage';
	import { projectsMapStore, userStore, usersMapStore } from '$lib/utils/store';
	import { DashboardRoutes, FirestoreCollections, LengthSettings } from '$shared/constants';
	import { truncateString } from '$shared/helpers';
	import { MessageType } from '$shared/message';
	import type { Activity, Project, User } from '$shared/models';
	import { onDestroy, onMount } from 'svelte';
	import { ArrowLeft, ExclamationTriangle, Pencil2, Reload, Shadow } from 'svelte-radix';
	import { sendMessage } from 'webext-bridge/window';

	import ProjectTour from '$lib/components/tour/ProjectTour.svelte';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index.js';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Resizable from '$lib/components/ui/resizable';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import ActivitiesPicker from './ActivitiesPicker.svelte';
	import ImageDetailView from './ImageDetailView.svelte';
	import ActivityDetail from './activities/ActivityDetail.svelte';
	import GithubModal from './github/GithubModal.svelte';

	let project: Project | undefined;
	const projectService = new FirebaseService<Project>(FirestoreCollections.PROJECTS);
	const userService = new FirebaseService<User>(FirestoreCollections.USERS);

	let user: User | null;
	let unsubs: any[] = [];
	let activeActivityId: string = '';
	let activeActivity: Activity | undefined;
	let githubModalOpen: boolean = false;
	let errorText = '';

	$: if (project) {
		activeActivity = Object.values(project.activities).find(
			(activity) => activity.id === activeActivityId
		);
	}

	onMount(async () => {
		auth.onAuthStateChanged((user) => {
			if (!user) {
				goto(DashboardRoutes.SIGNIN);
			}
		});

		userStore.subscribe((storeUser) => {
			if (!storeUser) return;
			user = storeUser;
		});

		// Get project
		const projectId = $page.params.id;
		if (!projectId) {
			goto(DashboardRoutes.DASHBOARD);
		}

		if ($projectsMapStore.has(projectId)) {
			project = $projectsMapStore.get(projectId);
		} else {
			projectService
				.subscribe(projectId, async (firebaseProject) => {
					if (!firebaseProject || !Object.keys(firebaseProject).length) {
						// Set timeout to error to give projects time to load
						setTimeout(() => (errorText = 'Project not found'), 10000);
						return;
					}
					$projectsMapStore.set(projectId, firebaseProject);
					projectsMapStore.set($projectsMapStore);
					project = firebaseProject;

					// Get store users from activities and comments
					const userIds = Object.values(project.activities)
						.map((item) => item.userId)
						.concat(project.comments.map((item) => item.userId));

					for (const userId of userIds) {
						if (!$usersMapStore.has(userId)) {
							const user = await userService.get(userId);
							user && usersMapStore.update((map) => map.set(userId, user));
						}
					}
				})
				.then((unsubscribe) => {
					unsubs.push(unsubscribe);
				})
				.catch((err) => {
					errorText = err.message;
				});
		}
	});

	onDestroy(() => {
		unsubs.forEach((unsub: any) => unsub());
	});

	function requestEditProject() {
		sendMessage(MessageType.EDIT_PROJECT, { project } as any);
		trackMixpanelEvent('Edit project from dashboard', {
			projectId: project?.id,
			projectName: project?.name,
			url: project?.hostUrl
		});
	}

	function pickActivity(activityId?: string) {
		if (activityId) {
			activeActivityId = activityId;
			return;
		}
		// If no activity provided, pick first available activity
		const activitiesVals = Object.values(project?.activities || {});
		if (activitiesVals.length) {
			activeActivityId = activitiesVals[0].id;
		}
	}
</script>

<svelte:head>
	<title>Onlook - {project?.name || 'Project'}</title>
</svelte:head>

<div class="flex h-screen w-screen flex-col bg-black text-primary">
	{#if project && user}
		<ProjectTour bind:user {pickActivity} />
		<!-- Header -->
		<div class="flex flex-row items-center h-14 px-4">
			<Breadcrumb.Root class="mr-auto ">
				<Breadcrumb.List>
					<Breadcrumb.Item>
						<Breadcrumb.Link href={DashboardRoutes.DASHBOARD}>Onlook</Breadcrumb.Link>
					</Breadcrumb.Item>
					<Breadcrumb.Separator class="p-0 m-0" />
					<Breadcrumb.Item>
						{truncateString(project?.name || 'Dashboard', LengthSettings.MAX_TITLE_LENGTH)}
					</Breadcrumb.Item>
				</Breadcrumb.List>
			</Breadcrumb.Root>
			<div class="flex flex-row ml-auto space-x-2">
				<Button variant="secondary" class="h-8" on:click={requestEditProject}
					><Pencil2 class="mr-2 w-4 h-4" /> Edit</Button
				>
				<GithubModal bind:githubModalOpen {requestEditProject} {projectService} {project} {user} />
			</div>
		</div>
		<!-- Main content -->
		<Separator />
		<Resizable.PaneGroup class="w-full" direction="horizontal">
			<Resizable.Pane minSize={20} defaultSize={60}>
				<ActivitiesPicker bind:githubModalOpen {projectService} {project} bind:activeActivityId />
			</Resizable.Pane>
			<Resizable.Handle class="hover:bg-surface-brand" />
			<Resizable.Pane minSize={20} defaultSize={40}>
				<ImageDetailView {activeActivity} {project} />
			</Resizable.Pane>
			{#if activeActivity}
				<Resizable.Handle class="hover:bg-surface-brand" />
				<Resizable.Pane minSize={10} defaultSize={20}>
					<div class="flex flex-col w-full h-full text-sm overflow-auto">
						<ActivityDetail {project} activity={activeActivity} />
					</div>
				</Resizable.Pane>
			{/if}
		</Resizable.PaneGroup>
	{:else if errorText}
		<div class="flex flex-col items-center justify-center h-full space-y-8 pb-10">
			<p class="flex flex-row items-center text-lg">
				<ExclamationTriangle class="mr-3" />
				{errorText}
			</p>

			<div class="">
				<Button variant="outline" class="ml-4" on:click={() => goto(DashboardRoutes.DASHBOARD)}
					><ArrowLeft class="mr-2 w-4 h-4" /> Return to dashboard</Button
				>
				<Button class="ml-4" variant="outline" on:click={() => window.location.reload()}
					><Reload class="mr-2 w-4 h-4" /> Retry</Button
				>
			</div>
		</div>
	{:else}
		<div class="flex flex-row items-center justify-center h-full pb-10">
			<Shadow class="animate-spin mr-2" />
			<p class="text-tertiary">Loading Project...</p>
		</div>
	{/if}
</div>
