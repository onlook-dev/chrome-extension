<script lang="ts">
	import { onMount } from 'svelte'
	import ArrowLeft from '~icons/formkit/arrowleft'
	import { PopupRoutes } from '$lib/utils/constants'
	import { popupStateBucket, projectsMapBucket, teamsMapBucket } from '$lib/utils/localstorage'
	import type { Project } from '$models/project'
	import type { HostData } from '$models/hostData'
	import type { Activity } from '$models/activity'
	import type { Comment } from '$models/comment'
	import { type EventMetadata, EventMetadataType } from '$models/eventData'

	import { nanoid } from 'nanoid'
	import validUrl from 'valid-url'
	import { postProjectToFirebase } from '$lib/storage/project'
	import { postTeamToFirebase } from '$lib/storage/team'

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

	function returnToDashboard() {
		popupStateBucket.set({ activeRoute: PopupRoutes.DASHBOARD })
	}

	async function createProject() {
		nameError = !projectName
		urlError = validUrl.isWebUri(projectUrl) === undefined

		if (nameError || urlError) {
			return
		}

		// TODO: Move to a service
		const { activeTeamId } = await popupStateBucket.get()
		const teamMap = new Map(Object.entries(await teamsMapBucket.get()))
		const team = teamMap.get(activeTeamId)

		const newProject = {
			id: nanoid(),
			name: projectName,
			teamId: activeTeamId,
			hostUrl: projectUrl,
			activities: [],
			comments: [],
			hostData: {} as HostData
		} as Project

		// Testing
		let activities: Activity[] = [
			{
				id: '1',
				userId: 'urGM6E9N7yf9hoBuc9lPBwRNf4m2',
				selector: 'body >',
				projectId: newProject?.id,
				eventData: [
					{
						key: 'click',
						value: 'click',
						type: EventMetadataType.SOURCE_MAP_ID
					} as EventMetadata
				],
				visible: true,
				creationTime: new Date(),
				styleChanges: [{ key: 'color', newVal: 'red', oldVal: 'blue' }]
			} as Activity,
			{
				id: '2',
				userId: 'urGM6E9N7yf9hoBuc9lPBwRNf4m2',
				selector: 'body >',
				projectId: newProject?.id,
				eventData: [
					{
						key: 'click',
						value: 'click',
						type: EventMetadataType.SOURCE_MAP_ID
					} as EventMetadata
				],
				visible: true,
				creationTime: new Date(),
				styleChanges: [{ key: 'color', newVal: 'red', oldVal: 'blue' }]
			} as Activity
		]
		let comments: Comment[] = [
			{
				id: '1',
				userId: 'urGM6E9N7yf9hoBuc9lPBwRNf4m2',
				projectId: newProject?.id,
				creationTime: new Date(),
				text: 'This is a comment'
			} as Comment,
			{
				id: '2',
				userId: 'urGM6E9N7yf9hoBuc9lPBwRNf4m2',
				projectId: newProject?.id,
				creationTime: new Date(),
				text: 'This is a comment, too'
			} as Comment
		]
		newProject.activities = activities
		newProject.comments = comments

		// End testing

		// Add project to team
		team?.projectIds.push(newProject.id)

		// Save locally
		projectsMapBucket.set({ [newProject.id]: newProject })
		teamsMapBucket.set({ [activeTeamId]: team })
		popupStateBucket.set({ activeRoute: PopupRoutes.PROJECT, activeProjectId: newProject.id })

		// Save to Firebase
		team && postTeamToFirebase(team)
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
