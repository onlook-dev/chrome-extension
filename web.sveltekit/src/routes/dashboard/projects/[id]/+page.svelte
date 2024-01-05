<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import type { ProjectImpl } from '$lib/models/project';
	import { getProjectFromFirebase } from '$lib/storage/project';
	import { ROUTE_DASHBOARD } from '$lib/utils/constants';
	import { projectsMapStore } from '$lib/utils/store';
	import { onMount } from 'svelte';

	let project: ProjectImpl | undefined;

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

<!-- Header -->
<div class="flex h-screen w-screen flex-col">
	<!-- Header -->
	<div class="navbar bg-base-100">
		<div class="navbar-start flex flex-row">
			<a class="btn btn-ghost text-sm" href={ROUTE_DASHBOARD}>Onlook</a>
			<p class="text-sm mr-4">/</p>
			<p class="">{project?.name}</p>
		</div>

		<div class="navbar-end space-x-2">
			<a class="btn btn-outline">Share</a>
			<a class="btn btn-primary">Publish</a>
		</div>
	</div>
	<!-- Main content -->
	<div class="flex flex-col sm:flex-row bg-gray-200 flex-grow overflow-auto">
		<!-- Screenshot -->
		<div class="sm:w-full flex flex-grow h-full bg-red-100">Screenshot</div>
		<!-- Sidebar/ comments + activities -->
		<div class="flex flex-col w-full sm:max-w-96 h-full bg-gray-100">
			<div class="h-1/2 w-full bg-green-100">Comments</div>
			<div class="h-1/2 w-full bg-green-200">Activities</div>
		</div>
	</div>
</div>
