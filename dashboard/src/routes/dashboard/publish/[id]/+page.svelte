<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { onMount, onDestroy } from 'svelte';
	import { DashboardRoutes, FirestoreCollections } from '$shared/constants';
	import { projectsMapStore, userStore, usersMapStore } from '$lib/utils/store';
	import { auth } from '$lib/firebase';
	import { FirebaseService } from '$lib/storage';
	import { ChevronLeft, Shadow } from 'svelte-radix';
	import { MessageService } from '$shared/message';
	import { trackMixpanelEvent } from '$lib/mixpanel/client';

	import type { User, Activity, Project } from '$shared/models';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import Publish from './Publish.svelte';

	let project: Project | undefined;
	let messageService: MessageService;
	let user: User | null;
	let unsubs: any[] = [];
	let activeActivityId: string = '';
	let activeActivity: Activity | undefined;
	const projectService = new FirebaseService<Project>(FirestoreCollections.PROJECTS);

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

		project = $projectsMapStore.get(projectId) ?? (await projectService.get(projectId));

		if (!project) {
			goto(DashboardRoutes.DASHBOARD);
		}

		if (!project.githubSettings) {
			goto(`${DashboardRoutes.PROJECTS}/${projectId}`);
		}
	});

	onDestroy(() => {
		unsubs.forEach((unsub: any) => unsub());
	});
</script>

<svelte:head>
	<title>Publish - {project?.name || 'Project'}</title>
</svelte:head>

<div class="flex h-screen w-screen flex-col bg-black text-tertiary">
	<!-- Header -->
	<div class="flex flex-row items-center h-14 px-4">
		<Button
			size="lg"
			variant="link"
			on:click={() => goto(`${DashboardRoutes.PROJECTS}/${project?.id}`)}
		>
			<ChevronLeft class="h-4 w-4 mr-2" />
			Back to Project</Button
		>
	</div>
	<!-- Main content -->
	<Separator />
	{#if project && user}
		<div class="p-8">
			<h1 class="text-primary text-lg font-light">Publish to Github</h1>
			<Publish {project} {user} />
		</div>
	{:else}
		<div class="flex flex-row items-center justify-center h-full">
			<Shadow class="animate-spin mr-2" />
			<p class="text-stone-500">Loading Project...</p>
		</div>
	{/if}
</div>
