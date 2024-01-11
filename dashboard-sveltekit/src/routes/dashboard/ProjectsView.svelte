<script lang="ts">
	import { goto } from '$app/navigation';
	import { getProjectFromFirebase } from '$lib/storage/project';
	import { ROUTE_PROJECTS } from '$lib/utils/constants';
	import { projectsMapStore } from '$lib/utils/store';
	import type { Team } from '$models/team';

	export let team: Team | undefined;

	$: team?.projectIds.forEach((projectId) => {
		if (!$projectsMapStore.has(projectId)) {
			getProjectFromFirebase(projectId).then((firebaseProject) => {
				projectsMapStore.update((map) => map.set(projectId, firebaseProject));
			});
		}
	});
</script>

<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
	{#if team?.projectIds.length}
		{#each team?.projectIds.map((id) => $projectsMapStore.get(id)) as project}
			<button
				on:click={() => goto(`${ROUTE_PROJECTS}/${project?.id}`)}
				class="rounded space-y-4 p-4 hover:shadow block"
			>
				<figure class="">
					{#if project?.previewImage}
						<img
							src={project.previewImage}
							alt={project.name}
							class="aspect-video rounded w-full"
						/>
					{:else}
						<div class="bg-gray-100 aspect-video rounded w-full" />
					{/if}
				</figure>
				<div class="flex items-center space-x-2">
					<div class="avatar">
						<div class="w-6 mask mask-circle">
							<!-- TODO: Get author from ID -->
							<!-- <img src={project?.author.profileImage} alt="Avatar of {project.author.name}" /> -->
						</div>
					</div>
					<div>
						<p class="text-sm font-semibold">{project?.name}</p>
						<p class="text-xs opacity-70">{project?.hostUrl}</p>
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
