<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	import type { Project } from '$models/project';
	import { getProjectFromFirebase } from '$lib/storage/project';
	import { ROUTE_DASHBOARD } from '$lib/utils/constants';
	import { projectsMapStore } from '$lib/utils/store';

	import Comments from './Comments.svelte';
	import Activities from './Activities.svelte';
	import ShareModal from './ShareModal.svelte';
	import PublishModal from './PublishModal.svelte';

	let project: Project | undefined;

	onMount(() => {
		// Get project
		const projectId = $page.params.id;
		if (!projectId) {
			goto(ROUTE_DASHBOARD);
		}
		if ($projectsMapStore.has(projectId)) {
			project = $projectsMapStore.get(projectId);
		} else {
			getProjectFromFirebase(projectId).then((firebaseProject) => {
				$projectsMapStore.set(projectId, firebaseProject);
				projectsMapStore.set($projectsMapStore);
				project = firebaseProject;
			});
		}
	});
</script>

<div class="flex h-screen w-screen flex-col">
	<!-- Header -->
	<div class="navbar bg-base-100">
		<div class="navbar-start flex flex-row">
			<a class="btn btn-ghost text-sm" href={ROUTE_DASHBOARD}>Onlook</a>
			<p class="text-sm mr-4">/</p>
			<p class="">{project?.name}</p>
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
			{#if project?.hostData?.previewImage}
				<img
					src={project?.hostData?.previewImage}
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
			<div class="border h-1/2 w-full">
				<Activities activities={project?.activities} />
			</div>
			<div class="border h-1/2 w-full">
				<Comments comments={project?.comments} />
			</div>
		</div>
	</div>
</div>
