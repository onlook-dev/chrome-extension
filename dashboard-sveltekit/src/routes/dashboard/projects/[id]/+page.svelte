<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	import type { Project } from '$shared/models/project';
	import { getProjectFromFirebase } from '$lib/storage/project';
	import { getUserFromFirebase } from '$lib/storage/user';
	import { DashboardRoutes } from '$shared/constants';
	import { projectsMapStore, usersMapStore } from '$lib/utils/store';

	import type { Activity } from '$shared/models/activity';
	import type { Comment } from '$shared/models/comment';
	import { EventMetadataType, type EventMetadata } from '$shared/models/eventData';

	import Comments from './Comments.svelte';
	import Activities from './Activities.svelte';
	import ShareModal from './ShareModal.svelte';
	import PublishModal from './PublishModal.svelte';

	let project: Project | undefined;

	onMount(async () => {
		// Get project
		const projectId = $page.params.id;
		if (!projectId) {
			goto(DashboardRoutes.DASHBOARD);
		}
		if ($projectsMapStore.has(projectId)) {
			project = $projectsMapStore.get(projectId);
		} else {
			const firebaseProject = await getProjectFromFirebase(projectId);

			$projectsMapStore.set(projectId, firebaseProject);
			projectsMapStore.set($projectsMapStore);
			project = firebaseProject;

			// Get store users from activities and comments
			const userIds = project.activities
				.map((item) => item.userId)
				.concat(project.comments.map((item) => item.userId));

			for (const userId of userIds) {
				if (!$usersMapStore.has(userId)) {
					const user = await getUserFromFirebase(userId);
					user && usersMapStore.update((map) => map.set(userId, user));
				}
			}
		}
	});
</script>

<div class="flex h-screen w-screen flex-col">
	{#if project}
		<!-- Header -->
		<div class="navbar bg-base-100">
			<div class="navbar-start flex flex-row">
				<a class="btn btn-ghost text-sm" href={DashboardRoutes.DASHBOARD}>Onlook</a>
				<p class="text-sm mr-4">/</p>
				<p class="">{project.name}</p>
			</div>

			<div class="navbar-end space-x-2">
				<ShareModal />
				<PublishModal />
			</div>
		</div>
		<!-- Main content -->
		<div class="flex flex-col sm:flex-row flex-grow overflow-auto">
			<!-- Screenshot -->
			<div class="sm:w-full flex flex-grow h-full border items-center justify-center">
				{#if project.hostData?.previewImage}
					<img
						src={project.hostData?.previewImage}
						alt="Screenshot"
						class="w-[80%] h-auto max-w-[80%] max-h-[80%] aspect-video skeleton mx-auto my-auto"
					/>
				{:else}
					<div
						class="w-[80%] h-auto max-w-[80%] max-h-[80%] aspect-video skeleton mx-auto my-auto"
					></div>
				{/if}
			</div>
			<!-- Sidebar/ comments + activities -->
			<div class="flex flex-col w-full sm:max-w-96 h-full text-sm">
				<div class="border h-1/2 w-full overflow-auto">
					<Activities {project} />
				</div>
				<div class="border h-1/2 w-full overflow-auto">
					<Comments {project} />
				</div>
			</div>
		</div>
	{:else}
		<div class="flex flex-col items-center justify-center h-full">
			<!-- TODO: Skeleton -->
			<p class="text-gray-500">Loading...</p>
		</div>
	{/if}
</div>
