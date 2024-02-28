<script lang="ts">
	import { goto } from '$app/navigation';
	import { onDestroy } from 'svelte';
	import { subscribeToProject } from '$lib/storage/project';
	import { DashboardRoutes } from '$shared/constants';
	import { projectsMapStore } from '$lib/utils/store';
	import type { Team } from '$shared/models/team';

	import ArrowUp from '~icons/mingcute/arrow-up-fill';
	import PinImage from '$lib/assets/tip-pin.png';

	export let team: Team | undefined;
	let unsubs: any[] = [];

	$: team?.projectIds.forEach((projectId) => {
		if (!$projectsMapStore.has(projectId)) {
			subscribeToProject(projectId, (firebaseProject) => {
				projectsMapStore.update((map) => map.set(projectId, firebaseProject));
			}).then((unsubscribe) => {
				unsubs.push(unsubscribe);
			});
		}
	});

	onDestroy(() => {
		unsubs.forEach((unsub: any) => unsub());
	});
</script>

<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
	{#if team?.projectIds.length}
		{#each team?.projectIds.map((id) => $projectsMapStore.get(id)) as project}
			<button
				on:click={() => goto(`${DashboardRoutes.PROJECTS}/${project?.id}`)}
				class="pb-0 pt-0 pr-0 pl-0"
			>
				<figure class="">
					{#if project?.hostData.previewImage}
						<img
							src={project.hostData.previewImage}
							alt={project.name}
							class="object-cover object-top aspect-video rounded w-full"
						/>
					{:else}
						<div class="bg-gray-100 aspect-video rounded w-full" />
					{/if}
				</figure>
				<div class="px-3 mt-3">
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
			<div class="absolute top-0 right-0 m-2">
				<!-- Arrow container for absolute positioning -->
				<div class="flex flex-col space-y-8">
					<ArrowUp class="h-6 w-6 absolute top-0 right-[7.5rem] m-2" />
					<span class="font-bold"> Click on extension icon </span>
				</div>
			</div>
			<p class="text-center">No projects yet<br /> Use extension to create project</p>
			<p class="mt-10 text-center"><b>Tip:</b> Pin the extension for easy access</p>
			<div class="flex justify-center">
				<img class="mt-4 h-auto max-w-lg rounded-lg" src={PinImage} alt="Pin extension tip" />
			</div>
		</div>
	{/if}
</div>
