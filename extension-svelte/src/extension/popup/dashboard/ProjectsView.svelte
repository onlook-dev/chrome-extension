<script lang="ts">
	import { onMount } from 'svelte'
	import type { Project } from '$shared/models/project'
	import {
		projectsMapBucket,
		popupStateBucket,
		teamsMapBucket,
		getTeamById
	} from '$lib/utils/localstorage'
	import { PopupRoutes } from '$lib/utils/constants'

	let projectsMap: Map<string, Project> = new Map()

	onMount(async () => {
		// Get active team's projects
		popupStateBucket.valueStream.subscribe(async ({ activeTeamId }) => {
			const team = await getTeamById(activeTeamId)
			if (team) {
				const teamProjectsMap = await projectsMapBucket.get()
				projectsMap = new Map(
					Object.entries(teamProjectsMap).filter(([_, project]) => project.teamId === team.id)
				)
			}
		})
	})
</script>

<div
	class="pb-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4"
>
	{#each projectsMap.values() as project}
		<button
			class="rounded space-y-4 p-4 hover:shadow block"
			on:click={() => {
				popupStateBucket.set({ activeRoute: PopupRoutes.PROJECT, activeProjectId: project.id })
			}}
		>
			<figure class="">
				<!-- TODO: Add preview image -->
				{#if project.hostData?.previewImage}
					<img
						src={project.hostData.previewImage}
						alt={project.name}
						class="aspect-video object-cover object-top rounded w-full"
					/>
				{:else}
					<div class="bg-gray-100 aspect-video rounded w-full" />
				{/if}
			</figure>
			<div class="flex items-center space-x-2">
				<div class="avatar placeholder">
					<div class="w-8 mask mask-circle">
						{#if project.hostData?.favicon}
							<img src={project.hostData.favicon} alt="Favicon of {project.hostUrl}" />
						{:else}
							<div class="bg-gray-100 rounded-full w-full h-full" />
						{/if}
					</div>
				</div>
				<div class="text-left overflow-x-hidden">
					<p class="text-sm font-semibold truncate">{project.name}</p>
					<p class="text-xs opacity-70 truncate">{project.hostUrl}</p>
				</div>
			</div>
		</button>
	{/each}

	{#if projectsMap.size === 0}
		<!-- TODO: Add call to action -->
		<div class="flex flex-col col-span-full mt-10 align-middle">
			<p class="text-center">No projects yet</p>
		</div>
	{/if}
</div>
