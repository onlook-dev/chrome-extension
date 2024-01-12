<script lang="ts">
	import { onMount } from 'svelte'
	import type { Project } from '$models/project'
	import { projectsMapBucket, popupStateBucket } from '$lib/utils/localstorage'
	import { PopupRoutes } from '$lib/utils/constants'
	import ArrowLeft from '~icons/formkit/arrowleft'

	let project: Project

	function returnToDashboard() {
		popupStateBucket.set({ activeRoute: PopupRoutes.DASHBOARD })
	}

	onMount(async () => {
		// Get active team's projects
		const { activeProjectId } = await popupStateBucket.get()
		const projectsMap = new Map(Object.entries(await projectsMapBucket.get()))
		project = projectsMap.get(activeProjectId)
	})
</script>

<div class="navbar p-none">
	<div class="flex-none">
		<button on:click={returnToDashboard} class="btn btn-sm btn-ghost">
			<ArrowLeft /> Dashboard</button
		>
	</div>
</div>

{#if project}
	<div></div>
{:else}
	<div class="flex flex-col gap-4 w-52">
		<div class="skeleton h-32 w-full"></div>
		<div class="skeleton h-4 w-28"></div>
		<div class="skeleton h-4 w-full"></div>
		<div class="skeleton h-4 w-full"></div>
	</div>
{/if}
