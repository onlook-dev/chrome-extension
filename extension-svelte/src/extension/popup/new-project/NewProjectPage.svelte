<script lang="ts">
	import { onMount } from 'svelte'
	import ArrowLeft from '~icons/formkit/arrowleft'
	import { PopupRoutes } from '$lib/utils/constants'
	import {
		getTeamById,
		popupStateBucket,
		projectsMapBucket,
		teamsMapBucket
	} from '$lib/utils/localstorage'
	import type { Project } from '$shared/models/project'
	import type { HostData } from '$shared/models/hostData'
	import { MAX_TITLE_LENGTH } from '$shared/constants'

	import { nanoid } from 'nanoid'
	import validUrl from 'valid-url'
	import { postProjectToFirebase } from '$lib/storage/project'

	let projectName = ''
	let projectUrl = ''
	let nameError = false
	let urlError = false

	onMount(() => {
		chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
			const tab = tabs[0]
			if (tab) {
				projectUrl = tab.url ?? ''
				projectName = tab.title ?? ''
			}
		})
	})

	$: if (projectName.length > MAX_TITLE_LENGTH) {
		projectName = projectName.slice(0, MAX_TITLE_LENGTH)
	}

	function returnToDashboard() {
		popupStateBucket.set({ activeRoute: PopupRoutes.DASHBOARD })
	}

	async function createProject() {
		nameError = !projectName || projectName.length === 0 || projectName.length > MAX_TITLE_LENGTH
		urlError = validUrl.isWebUri(projectUrl) === undefined

		if (nameError || urlError) {
			return
		}

		// TODO: Move to a service
		const { activeTeamId } = await popupStateBucket.get()
		const team = await getTeamById(activeTeamId)

		const newProject = {
			id: nanoid(),
			name: projectName,
			teamId: activeTeamId,
			hostUrl: projectUrl,
			activities: {},
			comments: [],
			hostData: {} as HostData,
			createdAt: new Date().toISOString(),
			githubHistory: []
		} as Project

		// Add project to team
		team?.projectIds.push(newProject.id)

		// Save locally
		projectsMapBucket.set({ [newProject.id]: newProject })
		teamsMapBucket.set({ [activeTeamId]: team })
		popupStateBucket.set({ activeRoute: PopupRoutes.PROJECT, activeProjectId: newProject.id })

		// Save to Firebase
		postProjectToFirebase(newProject)
	}
</script>

<div class="navbar p-none">
	<div class="flex-none">
		<button on:click={returnToDashboard} class="btn btn-square btn-ghost">
			<ArrowLeft />
		</button>
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
				class="input input-bordered w-full {nameError && 'input-error'}"
				maxlength={MAX_TITLE_LENGTH}
			/>

			{#if nameError}
				<p class="text-xs text-error">Project name is required</p>
			{/if}
		</div>

		<div class="space-y-2">
			<span class="label-text">URL</span>
			<input
				bind:value={projectUrl}
				on:input={() => (urlError = validUrl.isWebUri(projectUrl) === undefined)}
				type="url"
				placeholder="https://onlook.dev"
				class="input input-bordered w-full {urlError && 'input-error'}"
			/>
			{#if urlError}
				<p class="text-xs text-error">Please add a valid URL</p>
			{/if}
		</div>

		<div class="modal-action space-x-4">
			<button class="btn" on:click={returnToDashboard}>Cancel</button>
			<button class="btn btn-primary" on:click={createProject}>Create</button>
		</div>
	</div>
</div>
