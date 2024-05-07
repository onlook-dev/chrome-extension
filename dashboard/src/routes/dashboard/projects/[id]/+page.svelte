<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { onMount, onDestroy } from 'svelte';
	import { DashboardRoutes, MAX_TITLE_LENGTH, FirestoreCollections } from '$shared/constants';
	import { projectsMapStore, userStore, usersMapStore } from '$lib/utils/store';
	import { truncateString } from '$shared/helpers';
	import { auth } from '$lib/firebase';
	import { FirebaseService } from '$lib/storage';
	import { trackMixpanelEvent } from '$lib/mixpanel/client';
	import { GithubLogo, Pencil2, Shadow } from 'svelte-radix';
	import { MessageService, MessageType } from '$shared/message';

	import type { User, Activity, Project } from '$shared/models';

	import Button from '$lib/components/ui/button/button.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index.js';
	import * as Resizable from '$lib/components/ui/resizable';
	import ActivitiesPicker from './ActivitiesPicker.svelte';
	import ImageDetailView from './ImageDetailView.svelte';
	import GithubModal from './github/ConfigureModal.svelte';
	import ActivityDetail from './ActivityDetail.svelte';
	import { buttonVariants } from '$lib/components/ui/button';

	let project: Project | undefined;
	let messageService: MessageService;
	const projectService = new FirebaseService<Project>(FirestoreCollections.PROJECTS);
	const userService = new FirebaseService<User>(FirestoreCollections.USERS);

	let user: User | null;
	let unsubs: any[] = [];
	let activeActivityId: string = '';
	let activeActivity: Activity | undefined;
	let githubModalOpen: boolean = false;

	$: if (project) {
		activeActivity = Object.values(project.activities).find(
			(activity) => activity.id === activeActivityId
		);
	}

	onMount(async () => {
		messageService = MessageService.getInstance();
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
				});
		}
	});

	onDestroy(() => {
		unsubs.forEach((unsub: any) => unsub());
	});

	function requestEditProject() {
		messageService.publish(MessageType.EDIT_PROJECT, project);
		trackMixpanelEvent('Edit Project', { projectId: project?.id });
	}
</script>

<svelte:head>
	<title>Onlook - {project?.name || 'Project'}</title>
</svelte:head>

<div class="flex h-screen w-screen flex-col bg-black text-primary">
	{#if project && user}
		<!-- Header -->
		<div class="flex flex-row items-center h-14 px-4">
			<Breadcrumb.Root class="mr-auto ">
				<Breadcrumb.List>
					<Breadcrumb.Item>
						<Breadcrumb.Link href={DashboardRoutes.DASHBOARD}>Onlook</Breadcrumb.Link>
					</Breadcrumb.Item>
					<Breadcrumb.Separator class="p-0 m-0" />
					<Breadcrumb.Item>
						{truncateString(project?.name || 'Dashboard', MAX_TITLE_LENGTH)}
					</Breadcrumb.Item>
				</Breadcrumb.List>
			</Breadcrumb.Root>
			<div class="flex flex-row ml-auto space-x-2">
				<Button variant="secondary" class="h-8" on:click={requestEditProject}
					><Pencil2 class="mr-2 w-4 h-4" /> Edit</Button
				>
				<GithubModal bind:githubModalOpen {projectService} {project} {user} />
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
	{:else}
		<div class="flex flex-row items-center justify-center h-full">
			<Shadow class="animate-spin mr-2" />
			<p class="text-stone-500">Loading Project...</p>
		</div>
	{/if}
</div>
