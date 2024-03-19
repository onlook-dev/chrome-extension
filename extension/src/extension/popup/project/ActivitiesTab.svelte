<script lang="ts">
	import { onMount } from 'svelte'
	import type { Project } from '$shared/models/project'
	import type { Activity, ChangeValues } from '$shared/models/activity'
	import type { User } from '$shared/models/user'
	import { usersMapBucket, projectsMapBucket } from '$lib/utils/localstorage'
	import { sendActivityRevert, sendActivityApply } from '$lib/utils/messaging'
	import { jsToCssProperty } from '$shared/helpers'

	import { CodeBlock, storeHighlightJs } from '@skeletonlabs/skeleton'
	import hljs from 'highlight.js/lib/core'
	import css from 'highlight.js/lib/languages/css'
	import html from 'highlight.js/lib/languages/xml'
	import 'highlight.js/styles/github.css'

	import ItemHeader from './ItemHeader.svelte'
	import ClockArrow from '~icons/mdi/clock-arrow'
	import Trash from '~icons/material-symbols/delete'
	import { FirebaseService } from '$lib/storage'
	import { FirestoreCollections } from '$shared/constants'

	export let project: Project

	const projectService = new FirebaseService<Project>(FirestoreCollections.PROJECTS)
	let activities: Activity[] = []
	let usersMap: Map<string, User> = new Map()

	onMount(async () => {
		usersMap = new Map(Object.entries(await usersMapBucket.get()))
		storeHighlightJs.set(hljs)
		hljs.registerLanguage('css', css)
		hljs.registerLanguage('html', html)
	})

	$: activities = Object.values(project.activities).sort(
		(a, b) =>
			new Date(b.updatedAt ?? b.createdAt).getTime() -
			new Date(a.updatedAt ?? a.createdAt).getTime()
	)

	let deleteActivity = (activity: Activity, modalId: string) => {
		project.activities = Object.fromEntries(
			Object.entries(project.activities).filter(([key, value]) => value.id !== activity.id)
		)

		sendActivityRevert(activity)
		projectService.post(project)
		projectsMapBucket.set({ [project.id]: project })
		project = { ...project }
		closeModal(modalId)
	}

	function showModal(modalId: string) {
		const modal = document.getElementById(modalId) as HTMLDialogElement
		if (modal) {
			modal.showModal()
			modal.addEventListener(
				'click',
				event => {
					if (event.target === modal) {
						closeModal(modalId)
					}
				},
				{ once: true }
			)
		}
	}

	function closeModal(modalId: string) {
		const modal = document.getElementById(modalId) as HTMLDialogElement
		if (modal) {
			modal.close()
		}
	}

	function formatStyleChanges(styleChanges: Record<string, ChangeValues>): string {
		return Object.values(styleChanges)
			.map(({ key, newVal }) => `${jsToCssProperty(key)}: ${newVal};`)
			.join('\n')
	}
</script>

{#if activities.length === 0}
	<div class="flex flex-col items-center justify-center text-center h-full pt-6">
		<p class="text-gray-500">No activities yet<br />Start editing to see changes</p>
	</div>
{/if}
<div class="divide-y flex flex-col w-screen">
	{#each activities as activity}
		<div
			class="w-full p-4 flex flex-col pb-6 hover:bg-gray-50 transition duration-200 ease-in-out {!activity.visible
				? 'opacity-60'
				: ''}
					"
		>
			<!-- Item header -->
			<ItemHeader
				profileImageUrl={usersMap.get(activity.userId)?.profileImage}
				userName={usersMap.get(activity.userId)?.name}
				createdAt={activity.updatedAt ?? activity.createdAt}
			>
				<div class="tooltip tooltip-left" data-tip="View original">
					<button
						on:mousedown={() => {
							sendActivityRevert(activity)
						}}
						on:mouseup={() => {
							sendActivityApply(activity)
						}}
						class="btn btn-sm btn-square btn-ghost"
					>
						<ClockArrow />
					</button>
				</div>

				<div class="tooltip tooltip-left" data-tip="Delete activity">
					<button
						on:click={() => {
							showModal(activity.id)
						}}
						class="btn btn-sm btn-square btn-ghost"
					>
						<Trash />
					</button>
					<dialog id={activity.id} class="modal">
						<div class="modal-box">
							<h3 class="font-bold text-lg">Delete activity?</h3>
							<p class="py-4">Deleted activities can NOT be restored. Continue?</p>
							<div class="modal-action space-x-2">
								<button
									class="btn"
									on:click={() => {
										closeModal(activity.id)
									}}>Cancel</button
								>
								<button class="btn btn-error" on:click={() => deleteActivity(activity, activity.id)}
									>Delete</button
								>
							</div>
						</div>
						<form method="dialog" class="modal-backdrop">
							<button>close</button>
						</form>
					</dialog>
				</div>
			</ItemHeader>

			<!-- Item body -->

			<div class="flex flex-col space-y-3 w-full">
				<p>Selector:</p>
				<span class="text-orange-600 bg-gray-50 p-2 rounded border">{activity.selector}</span>

				{#if activity.path}
					<p>Path:</p>
					<span class="text-orange-600 bg-gray-50 p-2 rounded border">{activity.path}</span>
				{/if}

				{#if activity.styleChanges && Object.keys(activity.styleChanges).length > 0}
					<p>Code Change:</p>
					<CodeBlock
						class="text-xs bg-gray-50 rounded p-1 border w-[23rem] text-start overflow-scroll"
						language="css"
						code={formatStyleChanges(activity.styleChanges)}
						color="text-gray-800"
						text="text-xs"
						button="btn btn-xs ml-auto rounded-sm"
					/>
				{/if}

				{#if activity.textChanges && Object.keys(activity.textChanges).length > 0}
					<p>Text change:</p>
					<textarea
						disabled
						class="bg-gray-50 rounded p-4 border w-full text-start flex flex-col overflow-scroll text-gray-800 text-xs"
						value={activity.textChanges.text?.newVal ?? ''}
					/>
				{/if}

				{#if activity.insertChanges && Object.keys(activity.insertChanges).length > 0}
					<p>Inserted component:</p>
					<CodeBlock
						class="text-xs bg-gray-50 rounded p-1 border w-[23rem] text-start overflow-scroll"
						language="html"
						code={activity.insertChanges.childContent.newVal ?? ''}
						color="text-gray-800"
						text="text-xs"
						button="btn btn-xs ml-auto rounded-sm"
					/>
				{/if}

				{#if activity.removeChanges && Object.keys(activity.removeChanges).length > 0}
					<p>Removed component:</p>
					<CodeBlock
						class="text-xs bg-gray-50 rounded p-1 border w-[23rem] text-start overflow-auto "
						language="css"
						code={formatStyleChanges(activity.removeChanges)}
						color="text-gray-800"
						text="text-xs"
						button="btn btn-xs ml-auto rounded-sm"
					/>
				{/if}

				{#if activity.previewImage}
					<p>Preview image:</p>
					<img src={activity.previewImage} alt="Preview" class="w-full rounded border" />
				{/if}
			</div>
		</div>
	{/each}
</div>
