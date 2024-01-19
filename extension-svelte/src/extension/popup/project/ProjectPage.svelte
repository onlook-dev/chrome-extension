<script lang="ts">
	import { onMount } from 'svelte'

	import type { Project } from '$shared/models/project'
	import { popupStateBucket, getActiveProject, visbugStateBucket } from '$lib/utils/localstorage'
	import { PopupRoutes } from '$lib/utils/constants'
	import { sendEditProjectRequest } from '$lib/utils/messaging'

	import ArrowLeft from '~icons/formkit/arrowleft'
	import Pencil from '~icons/mdi/pencil'
	import Stop from '~icons/carbon/stop-outline'

	import SettingsTab from './SettingsTab.svelte'
	import ActivitiesTab from './ActivitiesTab.svelte'
	import CommentsTab from './CommentsTab.svelte'
	import { postProjectToFirebase } from '$lib/storage/project'

	const tabsName = 'project-tabs-id'
	let saved = false
	let project: Project | undefined
	let projectInjected: boolean = false

	$: projectEdited = Object.keys(project?.activities ?? {}).length > 0

	$: if (project) {
		saved = false
	}

	function returnToDashboard() {
		popupStateBucket.set({ activeRoute: PopupRoutes.DASHBOARD })
	}

	onMount(async () => {
		// Get active team's projects
		project = await getActiveProject()

		visbugStateBucket.valueStream.subscribe(({ injectedProjects }) => {
			if (!project || !injectedProjects) return
			projectInjected =
				Object.keys(injectedProjects).includes(project.id) && injectedProjects[project?.id]
		})
	})

	function toggleEditing() {
		project && sendEditProjectRequest(project)
	}

	function truncateString(str: string, num: number) {
		if (str.length <= num) {
			return str
		}
		return str.slice(0, num) + '...'
	}
</script>

<div class="navbar p-none border">
	<div class="flex-1">
		<button on:click={returnToDashboard} class="btn btn-sm btn-ghost">
			<ArrowLeft /> {truncateString(project?.name || 'Dashboard', 20)}</button
		>
	</div>
	<div class="flex-none">
		<button class="btn btn-sm btn-outline" on:click={toggleEditing}>
			{#if projectInjected}
				<Stop />
				{projectEdited ? 'Stop' : 'Stop editing'}
			{:else}
				<Pencil />
				{projectEdited ? 'Edit' : 'Start editing'}
			{/if}
		</button>
		{#if projectEdited}
			<button
				disabled={saved}
				on:click={() => {
					if (project && !saved) {
						postProjectToFirebase(project)
						saved = true
					}
				}}
				class="ml-2 btn btn-sm btn-primary">{saved ? 'Saved' : 'Save'}</button
			>
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
