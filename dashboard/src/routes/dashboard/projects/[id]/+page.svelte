<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { onMount, onDestroy } from 'svelte';
	import {
		DashboardRoutes,
		DashboardSearchParams,
		MessageTypes,
		MAX_TITLE_LENGTH,
		FirestoreCollections
	} from '$shared/constants';
	import { projectsMapStore, userStore, usersMapStore } from '$lib/utils/store';
	import { timeSince, truncateString, shortenSelector } from '$shared/helpers';
	import { auth } from '$lib/firebase';
	import { FirebaseService } from '$lib/storage';
	import { trackMixpanelEvent } from '$lib/mixpanel/client';
	import { GithubLogo, Pencil2 } from 'svelte-radix';

	import type { User } from '$shared/models/user';
	import type { Activity } from '$shared/models/activity';
	import type { Project } from '$shared/models/project';

	import Button from '$lib/components/ui/button/button.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index.js';
	import * as Resizable from '$lib/components/ui/resizable';
	import ActivitiesPicker from './ActivitiesPicker.svelte';
	import ImageDetailView from './ImageDetailView.svelte';
	import PublishToGithubModal from './github/PublishToGithubModal.svelte';

	let project: Project | undefined;
	const projectService = new FirebaseService<Project>(FirestoreCollections.PROJECTS);
	const userService = new FirebaseService<User>(FirestoreCollections.USERS);

	let user: User | null;
	let unsubs: any[] = [];
	let activeActivityId: string = '';
	let activeActivity: Activity | undefined;

	let activityCols = 'grid-col-4';

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
				});
		}
	});

	onDestroy(() => {
		unsubs.forEach((unsub: any) => unsub());
	});

	function requestEditProject() {
		window.postMessage(
			{
				type: MessageTypes.EDIT_PROJECT,
				project: project
			},
			window.location.origin
		);
		trackMixpanelEvent('Edit Project', { projectId: project?.id });
	}
</script>

<div class="flex h-screen w-screen flex-col bg-black text-white">
	{#if project && user}
		<!-- Header -->
		<div class="flex flex-row items-center h-14 px-4">
			<Breadcrumb.Root class="mr-auto ">
				<Breadcrumb.List>
					<Breadcrumb.Item>
						<Breadcrumb.Link
							href="{DashboardRoutes.DASHBOARD}?{DashboardSearchParams.TEAM}={project?.teamId}"
							>Onlook</Breadcrumb.Link
						>
					</Breadcrumb.Item>
					<Breadcrumb.Separator class="p-0 m-0" />
					<Breadcrumb.Item>
						{truncateString(project?.name || 'Dashboard', MAX_TITLE_LENGTH)}
					</Breadcrumb.Item>
				</Breadcrumb.List>
			</Breadcrumb.Root>
			<Button class="bg-surface text-gray-500">Placeholder</Button>
			<div class="flex flex-row ml-auto space-x-2">
				<Button variant="secondary" class="h-8" on:click={requestEditProject}
					><Pencil2 class="mr-2 w-4 h-4" /> Edit</Button
				>

				<PublishToGithubModal {project} {user} />
			</div>
		</div>
		<!-- Main content -->
		<Separator />
		<Resizable.PaneGroup class="w-full" direction="horizontal">
			<Resizable.Pane
				minSize={20}
				defaultSize={60}
				onResize={(size) => {
					if (size < 23) {
						activityCols = 'grid-cols-1';
					} else if (size < 33) {
						activityCols = 'grid-cols-2';
					} else if (size < 43) {
						activityCols = 'grid-cols-3';
					} else {
						activityCols = 'grid-cols-4';
					}
				}}
			>
				<ActivitiesPicker {activityCols} {project} bind:activeActivityId />
			</Resizable.Pane>
			<Resizable.Handle class="hover:bg-surface-brand" />
			<Resizable.Pane minSize={20}>
				<ImageDetailView {activeActivity} {project} />
			</Resizable.Pane>
			<!-- <Resizable.Handle />
			<Resizable.Pane>
				<div class="flex flex-col w-full h-full text-sm">
					<div class="border h-full w-full overflow-auto">
						<Activities {project} bind:activeActivityId />
					</div>
				</div>
			</Resizable.Pane> -->
		</Resizable.PaneGroup>
	{:else}
		<div class="flex flex-col items-center justify-center h-full">
			<p class="text-gray-500">Loading...</p>
		</div>
	{/if}
</div>
