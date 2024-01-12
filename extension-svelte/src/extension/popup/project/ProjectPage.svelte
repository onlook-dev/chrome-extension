<script lang="ts">
	import { onMount } from 'svelte'
	import type { Project } from '$models/project'
	import { projectsMapBucket, popupStateBucket } from '$lib/utils/localstorage'
	import { PopupRoutes } from '$lib/utils/constants'
	import ArrowLeft from '~icons/formkit/arrowleft'
	import Pencil from '~icons/mdi/pencil'
	import { sendEditProjectRequest } from '$lib/utils/messaging'

	let project: Project | undefined
	const tabsName = 'project-tabs-id'
	function returnToDashboard() {
		popupStateBucket.set({ activeRoute: PopupRoutes.DASHBOARD })
	}

	onMount(async () => {
		// Get active team's projects
		const { activeProjectId } = await popupStateBucket.get()
		const projectsMap = new Map(Object.entries(await projectsMapBucket.get()))
		project = projectsMap.get(activeProjectId)
	})

	function deleteProject() {
		projectsMapBucket.remove(project?.id ?? '')
		popupStateBucket.set({ activeRoute: PopupRoutes.DASHBOARD, activeProjectId: '' })
	}

	function startEditing() {
		project && sendEditProjectRequest(project)
	}
</script>

<div class="navbar p-none border">
	<div class="flex-1">
		<button on:click={returnToDashboard} class="btn btn-sm btn-ghost">
			<ArrowLeft /> Dashboard</button
		>
	</div>
	<div class="flex-none">
		<button class="btn btn-sm btn-outline" on:click={startEditing}>
			<Pencil />
			{#if project?.changeSets.length}
				Edit
			{:else}
				Start editing
			{/if}
		</button>
		{#if project?.changeSets.length}
			<button class="ml-2 btn btn-sm btn-primary">Publish</button>
		{/if}
	</div>
</div>

{#if project}
	<div role="tablist" class="tabs tabs-bordered tabs-md bt py-4">
		<input type="radio" name={tabsName} role="tab" class="tab" aria-label="General" checked />
		<div role="tabpanel" class="tab-content">
			<div class="flex flex-col gap-4 w-52">
				<div class="skeleton h-32 w-full"></div>
				<div class="skeleton h-4 w-28"></div>
				<div class="skeleton h-4 w-full"></div>
				<div class="skeleton h-4 w-full"></div>
			</div>
		</div>

		<input type="radio" name={tabsName} role="tab" class="tab" aria-label="Comments" />
		<div role="tabpanel" class="tab-content">Tab content 2</div>

		<input type="radio" name={tabsName} role="tab" class="tab" aria-label="Activities" />
		<div role="tabpanel" class="tab-content">Tab content 3</div>

		<input type="radio" name={tabsName} role="tab" class="tab" aria-label="Settings" />
		<div role="tabpanel" class="tab-content">
			<button on:click={deleteProject} class="btn btn-outline btn-error"> Delete project </button>
		</div>
	</div>
{:else}
	<div class="flex flex-col gap-4 w-52">
		<div class="skeleton h-32 w-full"></div>
		<div class="skeleton h-4 w-28"></div>
		<div class="skeleton h-4 w-full"></div>
		<div class="skeleton h-4 w-full"></div>
	</div>
{/if}
