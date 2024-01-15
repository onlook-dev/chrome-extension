<script lang="ts">
	import { goto } from '$app/navigation';
	import { getProjectFromFirebase } from '$lib/storage/project';
	import { DashboardRoutes } from '$shared/constants';
	import { projectsMapStore } from '$lib/utils/store';
	import type { Team } from '$shared/models/team';

	export let team: Team | undefined;

	$: team?.projectIds.forEach((projectId) => {
		if (!$projectsMapStore.has(projectId)) {
			getProjectFromFirebase(projectId).then((firebaseProject) => {
				projectsMapStore.update((map) => map.set(projectId, firebaseProject));
			});
		}
	});
</script>

<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
	{#if team?.projectIds.length}
		{#each team?.projectIds.map((id) => $projectsMapStore.get(id)) as project}
			<button
				on:click={() => goto(`${DashboardRoutes.PROJECTS}/${project?.id}`)}
				class="rounded space-y-4 p-4 hover:shadow block"
			>
				<figure class="">
					{#if project?.hostData.previewImage}
						<img
							src={project.hostData.previewImage}
							alt={project.name}
							class="aspect-video rounded w-full"
						/>
					{:else}
						<div class="bg-gray-100 aspect-video rounded w-full" />
					{/if}
				</figure>
				<div class="flex items-center space-x-2">
					<div class="avatar">
						<div class="w-8 mask mask-circle">
							<!-- TODO: Get author from ID -->
							{#if project?.hostData?.favicon}
								<img src={project.hostData.favicon} alt="Favicon of {project.hostUrl}" />
							{:else}
								<div class="bg-gray-100 rounded-full w-full h-full" />
							{/if}
						</div>
					</div>
					<div class="text-left overflow-x-hidden">
						<p class="text-sm font-semibold truncate">{project?.name}</p>
						<p class="text-xs opacity-70 truncate">{project?.hostUrl}</p>
					</div>
				</div>
			</button>
		{/each}
	{:else}
		<!-- TODO: Add call to action -->
		<div class="col-span-full mt-10">
			<p class="text-center">No projects yet</p>
		</div>
	{/if}
</div>
