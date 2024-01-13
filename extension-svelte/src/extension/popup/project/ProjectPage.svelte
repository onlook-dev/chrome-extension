<script lang="ts">
	import { onMount } from 'svelte'

	import type { Project } from '$models/project'
	import { projectsMapBucket, popupStateBucket } from '$lib/utils/localstorage'
	import { PopupRoutes } from '$lib/utils/constants'
	import { sendEditProjectRequest } from '$lib/utils/messaging'

	import ArrowLeft from '~icons/formkit/arrowleft'
	import Pencil from '~icons/mdi/pencil'
	import SettingsTab from './SettingsTab.svelte'
	import ActivitiesTab from './ActivitiesTab.svelte'
	import CommentsTab from './CommentsTab.svelte'

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

	function startEditing() {
		project && sendEditProjectRequest(project)
	}
</script>

<div class="navbar p-none border">
	<div class="flex-1">
		<button on:click={returnToDashboard} class="btn btn-sm btn-ghost">
			<ArrowLeft /> {project?.name}</button
		>
	</div>
	<div class="flex-none">
		<button class="btn btn-sm btn-outline" on:click={startEditing}>
			<Pencil />
			{#if project?.activities.length}
				Edit
			{:else}
				Start editing
			{/if}
		</button>
		{#if project?.activities.length}
			<button class="ml-2 btn btn-sm btn-primary">Publish</button>
		{/if}
	</div>
</div>

{#if project}
	<div role="tablist" class="tabs tabs-bordered tabs-md bt py-4">
		<input checked type="radio" name={tabsName} role="tab" class="tab" aria-label="Activities" />
		<div role="tabpanel" class="tab-content">
			<ActivitiesTab {project} />
		</div>

		<input type="radio" name={tabsName} role="tab" class="tab" aria-label="Comments" />
		<div role="tabpanel" class="tab-content">
			<CommentsTab {project} />
		</div>

		<input type="radio" name={tabsName} role="tab" class="tab" aria-label="Settings" />
		<div role="tabpanel" class="tab-content">
			<SettingsTab {project} />
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
