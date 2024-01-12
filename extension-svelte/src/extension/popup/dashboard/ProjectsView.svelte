<script lang="ts">
	import { onMount } from 'svelte'
	import type { Project } from '$models/project'
	import { projectsMapBucket, popupStateBucket, teamsMapBucket } from '$lib/utils/localstorage'

	let projectsMap: Map<string, Project> = new Map()

	onMount(async () => {
		// Get active team's projects
		popupStateBucket.valueStream.subscribe(async ({ activeTeamId }) => {
			const teamMap = new Map(Object.entries(await teamsMapBucket.get()))
			const team = teamMap.get(activeTeamId)
			if (team) {
				const teamProjectsMap = await projectsMapBucket.get()
				projectsMap = new Map(
					Object.entries(teamProjectsMap).filter(([_, project]) => project.teamId === team.id)
				)
			}
		})
	})
</script>

<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
	{#each projectsMap.values() as project}
		<button class="rounded space-y-4 p-4 hover:shadow block">
			<figure class="">
				<!-- TODO: Add preview image -->
				{#if project.hostData?.previewImage}
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
					<div class="w-6 mask mask-circle">
						<!-- <img src={project.author.profileImage} alt="Avatar of {project.author.name}" /> -->
					</div>
				</div>
				<div>
					<p class="text-sm font-semibold">{project.name}</p>
					<p class="text-xs opacity-70">{project.hostData}</p>
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
