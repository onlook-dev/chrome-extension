<script lang="ts">
	import type { ProjectImpl } from '$lib/models/project'
	const projectsMap: Map<string, ProjectImpl> = new Map()
</script>

<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
	{#each projectsMap.values() as project}
		<a class="rounded space-y-4 p-4 hover:shadow block">
			<figure class="">
				<!-- TODO: Add preview image -->
				{#if project.previewImage}
					<img src={project.previewImage} alt={project.name} class="aspect-video rounded w-full" />
				{:else}
					<div class="bg-gray-100 aspect-video rounded w-full" />
				{/if}
			</figure>
			<div class="flex items-center space-x-2">
				<div class="avatar">
					<div class="w-6 mask mask-circle">
						<img src={project.author.profileImage} alt="Avatar of {project.author.name}" />
					</div>
				</div>
				<div>
					<p class="text-sm font-semibold">{project.name}</p>
					<p class="text-xs opacity-70">{project.host}</p>
				</div>
			</div>
		</a>
	{/each}

	{#if projectsMap.size === 0}
		<!-- TODO: Add call to action -->
		<div class="col-span-full mt-10">
			<p class="text-center">No projects yet</p>
		</div>
	{/if}
</div>
