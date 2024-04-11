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
	import { truncateString } from '$shared/helpers';
	import { auth } from '$lib/firebase';
	import { FirebaseService } from '$lib/storage';
	import { trackMixpanelEvent } from '$lib/mixpanel/client';
	import { GithubLogo, Pencil2 } from 'svelte-radix';

	import Activities from './Activities.svelte';
	import ShareModal from './ShareModal.svelte';
	import Slack from '~icons/devicon/slack';
	import Jira from '~icons/logos/jira';
	import Linear from '~icons/logos/linear-icon';
	import PublishToGithubModal from './github/PublishToGithubModal.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import * as Resizable from '$lib/components/ui/resizable';

	import type { Activity } from '$shared/models/activity';
	import type { User } from '$shared/models/user';
	import type { Project } from '$shared/models/project';

	let project: Project | undefined;
	const projectService = new FirebaseService<Project>(FirestoreCollections.PROJECTS);
	const userService = new FirebaseService<User>(FirestoreCollections.USERS);

	let user: User | null;
	let unsubs: any[] = [];
	let activeActivityId: string = '';
	let activeActivity: Activity | undefined;

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
				<Button variant="primary" class="h-8" on:click={requestEditProject}
					><GithubLogo class="mr-2 w-4 h-4" /> Publish to GitHub</Button
				>
				<!-- <div class="dropdown dropdown-end">
					<button class="btn btn-primary">Share and Publish</button>
					<ul class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
						<li tabindex="-1"><PublishToGithubModal {project} {user} /></li>
						<li><ShareModal teamId={project.teamId} /></li>
						<div class="divider">Coming soon</div>
						<li class="opacity-60">
							<button disabled><Linear /> Open Linear ticket</button>
						</li>
						<li class="opacity-60">
							<button disabled><Jira /> Open Jira ticket</button>
						</li>
						<li class="opacity-60">
							<button disabled><Slack /> Create Slack thread</button>
						</li>
					</ul>
				</div> -->
			</div>
		</div>
		<!-- Main content -->
		<Resizable.PaneGroup class="w-full border" direction="horizontal">
			<Resizable.Pane>
				<div class="bg-black w-full h-full items-center justify-center">Hello world</div>
			</Resizable.Pane>
			<Resizable.Handle class="hover:bg-surface-brand" />
			<Resizable.Pane>
				<!-- Screenshot -->
				<div class="bg-surface flex w-full h-full items-center justify-center">
					{#if activeActivity && activeActivity.previewImage}
						<img
							src={activeActivity.previewImage}
							alt="Screenshot"
							class="shadow max-w-[80%] mx-auto my-auto"
						/>
					{:else if project.hostData?.previewImage}
						<img
							src={project.hostData?.previewImage}
							alt="Screenshot"
							class="shadow w-[80%] h-auto max-w-[80%] max-h-[80%] object-cover object-top aspect-video skeleton mx-auto my-auto"
						/>
					{:else}
						<div
							class="shadow w-[80%] h-auto max-w-[80%] max-h-[80%] aspect-video skeleton mx-auto my-auto"
						></div>
					{/if}
				</div>
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
