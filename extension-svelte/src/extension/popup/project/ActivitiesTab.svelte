<script lang="ts">
	import { onMount } from 'svelte'
	import type { Project } from '$shared/models/project'
	import type { Activity } from '$shared/models/activity'
	import type { User } from '$shared/models/user'
	import { EventMetadataType, getEventDataByType } from '$shared/models/eventData'
	import { usersMapBucket, projectsMapBucket } from '$lib/utils/localstorage'
	import {
		sendActivityInspect,
		sendOpenUrlRequest,
		sendActivityRevert,
		sendActivityApply
	} from '$lib/utils/messaging'
	import { DASHBOARD_URL, DashboardRoutes, MouseEvent } from '$shared/constants'
	import { jsToCssProperty } from '$shared/helpers'

	import ItemHeader from './ItemHeader.svelte'
	import Open from '~icons/ion/open-outline'
	import Undo from '~icons/material-symbols/undo'
	import Trash from '~icons/material-symbols/delete'

	export let project: Project

	const modalId = 'delete-activity-modal'
	let activities: Activity[] = []
	let usersMap: Map<string, User> = new Map()

	onMount(async () => {
		usersMap = new Map(Object.entries(await usersMapBucket.get()))
	})

	$: activities = Object.values(project.activities).sort(
		(a, b) => new Date(a.creationTime).getTime() - new Date(b.creationTime).getTime()
	)

	let deleteActivity = (activity: Activity) => {
		project.activities = Object.fromEntries(
			Object.entries(project.activities).filter(([key, value]) => key !== activity.selector)
		)

		projectsMapBucket.set({ [project.id]: project })
		project = { ...project }
		sendActivityRevert(activity)
		closeModal()
	}

	let clickActivity = (activity: Activity) => {
		sendActivityInspect({
			selector: activity.selector,
			event: MouseEvent.CLICK,
			scrollToElement: true
		})
	}

	let hoverActivity = (activity: Activity) => {
		// sendActivityInspect({
		// 	selector: activity.selector,
		// 	event: MouseEvent.MOUSEMOVE,
		// 	scrollToElement: false
		// })
	}
	let leaveActivity = (activity: Activity) => {
		// sendActivityInspect({
		// 	selector: activity.selector,
		// 	event: MouseEvent.MOUSEMOVE,
		// 	scrollToElement: false
		// })
	}

	function showModal() {
		const modal = document.getElementById(modalId) as HTMLDialogElement
		if (modal) {
			modal.showModal()
			modal.addEventListener(
				'click',
				event => {
					if (event.target === modal) {
						closeModal()
					}
				},
				{ once: true }
			)
		}
	}

	function closeModal() {
		const modal = document.getElementById(modalId) as HTMLDialogElement
		if (modal) {
			modal.close()
		}
	}
</script>

{#if activities.length === 0}
	<div class="flex flex-col items-center justify-center text-center h-full pt-6">
		<p class="text-gray-500">No activities yet<br />Start editing to see changes</p>
	</div>
{/if}
<div class="divide-y flex flex-col w-full">
	{#each activities as activity}
		<!-- TODO: Add helper -->
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<div
			class="w-full p-4 flex flex-col pb-6 hover:bg-gray-50 transition duration-200 ease-in-out {!activity.visible
				? 'opacity-60'
				: ''}
					"
			on:mouseenter={() => hoverActivity(activity)}
			on:mouseleave={() => leaveActivity(activity)}
			on:click={() => clickActivity(activity)}
		>
			<!-- Item header -->
			<ItemHeader
				profileImageUrl={usersMap.get(activity.userId)?.profileImage}
				userName={usersMap.get(activity.userId)?.name}
				creationTime={activity.creationTime}
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
						<Undo />
					</button>
				</div>
				<div class="tooltip tooltip-left" data-tip="Open in dashboard">
					<button
						on:click={() =>
							sendOpenUrlRequest(`${DASHBOARD_URL}${DashboardRoutes.PROJECTS}/${project.id}`)}
						class="btn btn-sm btn-square btn-ghost"
					>
						<Open />
					</button>
				</div>
				<div class="tooltip tooltip-left" data-tip="Delete activity">
					<button on:click={showModal} class="btn btn-sm btn-square btn-ghost">
						<Trash />
					</button>
					<dialog id={modalId} class="modal">
						<div class="modal-box">
							<h3 class="font-bold text-lg">Delete activity?</h3>
							<p class="py-4">Deleted activities can NOT be restored. Continue?</p>
							<div class="modal-action space-x-2">
								<button class="btn" on:click={closeModal}>Cancel</button>
								<button class="btn btn-error" on:click={() => deleteActivity(activity)}
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
			<div class="mb-2 w-full text-start">
				Element:
				<span class="text-orange-600 bg-gray-100 p-0.5 rounded border">{activity.selector}</span>
			</div>

			{#if getEventDataByType(activity.eventData, EventMetadataType.SOURCE_MAP_ID)}
				<div class="mb-2 w-full text-start">
					Source:
					<button
						on:click={() => {}}
						class="btn btn-link text-orange-600 bg-gray-100 p-0.5 rounded border hover:underline"
						>{getEventDataByType(activity.eventData, EventMetadataType.SOURCE_MAP_ID)}</button
					>
				</div>
			{/if}
			<div class="bg-gray-50 rounded p-4 border w-full text-start flex flex-col">
				{#each Object.values(activity.styleChanges) as styleChange}
					<span class="">{jsToCssProperty(styleChange.key)}: {styleChange.newVal};</span>
				{/each}
			</div>
		</div>
	{/each}
</div>
