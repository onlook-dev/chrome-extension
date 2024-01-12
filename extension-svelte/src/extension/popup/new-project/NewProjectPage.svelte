<script lang="ts">
	import ArrowLeft from '~icons/formkit/arrowleft'
	import { PopupRoutes } from '$lib/utils/constants'
	import { popupStateBucket, projectsMapBucket } from '$lib/utils/localstorage'
	import type { Project } from '$models/project'
	import type { HostData } from '$models/hostData'

	import { nanoid } from 'nanoid'

	let projectName = ''
	let projectUrl = ''

	function returnToDashboard() {
		popupStateBucket.set({ activeRoute: PopupRoutes.DASHBOARD })
	}

	function createProject() {
		if (!projectName) {
			alert('Please enter a project name >:(')
			return
		}
		if (!projectUrl) {
			alert('Please enter a project URL  >:(')
			return
		}
		popupStateBucket.get().then(({ activeTeamId }) => {
			const newProject = {
				id: nanoid(),
				name: projectName,
				teamId: activeTeamId,
				hostUrl: projectUrl,
				changeSets: [],
				comments: [],
				hostData: {} as HostData
			} as Project

			projectsMapBucket.set({ [newProject.id]: newProject })
			popupStateBucket.set({ activeRoute: PopupRoutes.PROJECT, activeProjectId: newProject.id })
		})
	}
</script>

<div class="navbar p-none">
	<div class="flex-none">
		<button on:click={returnToDashboard} class="btn btn-sm btn-ghost">
			<ArrowLeft /> Dashboard</button
		>
	</div>
</div>

<div class="px-4 space-y-2">
	<h3 class="text-center font-bold text-lg mb-2">Create new project</h3>

	<div class="flex flex-col space-y-4">
		<div class="space-y-2">
			<span class="label-text">Name</span>
			<input
				bind:value={projectName}
				type="text"
				placeholder="My project"
				class="input input-bordered w-full"
			/>
		</div>

		<div class="space-y-2">
			<span class="label-text">URL</span>
			<input
				bind:value={projectUrl}
				type="url"
				placeholder="https://onlook.dev"
				class="input input-bordered w-full"
			/>
		</div>

		<div class="modal-action space-x-4">
			<button class="btn" on:click={returnToDashboard}>Cancel</button>
			<button class="btn btn-primary" on:click={createProject}>Create</button>
		</div>
	</div>
</div>
