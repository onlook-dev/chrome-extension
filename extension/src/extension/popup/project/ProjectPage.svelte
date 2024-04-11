<script lang="ts">
	import { onMount } from 'svelte'

	import type { Project } from '$shared/models/project'
	import {
		popupStateBucket,
		getActiveProject,
		tabsMapBucket,
		type VisbugState,
		InjectState
	} from '$lib/utils/localstorage'
	import { PopupRoutes } from '$lib/utils/constants'
	import { sendEditProjectRequest, sendOpenUrlRequest } from '$lib/utils/messaging'
	import { truncateString } from '$shared/helpers'
	import { baseUrl } from '$lib/utils/env'
	import { DashboardRoutes } from '$shared/constants'
	import { FirebaseProjectService } from '$lib/storage/project'

	import ArrowLeft from '~icons/formkit/arrowleft'
	import Pencil from '~icons/mdi/pencil'
	import Stop from '~icons/carbon/stop-outline'
	import SettingsTab from './SettingsTab.svelte'
	import ActivitiesTab from './ActivitiesTab.svelte'
	import CommentsTab from './CommentsTab.svelte'

	const tabsName = 'project-tabs-id'
	const projectService = new FirebaseProjectService()
	let saved = false
	let project: Project | undefined
	let projectInjected: boolean = false
	let publishing = false

	$: projectEdited = Object.keys(project?.activities ?? {}).length > 0

	$: if (project) {
		saved = false
	}

	function returnToDashboard() {
		if (project) {
			sendEditProjectRequest({ project, enable: false })
			projectService.post(project)
		}
		popupStateBucket.set({ activeRoute: PopupRoutes.DASHBOARD, activeProjectId: '' })
	}

	onMount(async () => {
		// Get active team's projects
		project = await getActiveProject()

		tabsMapBucket.valueStream.subscribe((visbugMap: Map<string, VisbugState>) => {
			let tabStates: VisbugState[] = Object.values(visbugMap)
			projectInjected = tabStates.some(
				tabState => tabState.projectId === project?.id && tabState.state === InjectState.injected
			)
		})
	})

	function toggleEditing() {
		if (project) {
			sendEditProjectRequest({ project, enable: !projectInjected })
			projectService.post(project)
		}
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
			<div class="ml-2">
				<button
					class="btn btn-sm btn-primary"
					disabled={publishing}
					on:click={() => {
						publishing = true
						if (project) {
							sendEditProjectRequest({ project, enable: false })
							projectService.post(project).then(() => {
								publishing = false
								sendOpenUrlRequest(`${baseUrl}${DashboardRoutes.PROJECTS}/${project?.id}`)
							})
						}
					}}>Review</button
				>
			</div>
		{/if}
	</div>
</div>

{#if project}
	<div role="tablist" class="tabs tabs-bordered tabs-md bt py-4">
		<input checked type="radio" name={tabsName} role="tab" class="tab" aria-label="Activities" />
		<div role="tabpanel" class="tab-content">
			<ActivitiesTab {project} />
		</div>

		<input type="radio" name={tabsName} role="tab" class="tab hidden" aria-label="Comments" />
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
