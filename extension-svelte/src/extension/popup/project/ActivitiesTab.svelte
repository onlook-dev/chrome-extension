<script lang="ts">
	import { onMount } from 'svelte'
	import type { Project } from '$shared/models/project'
	import type { Activity, StyleChange } from '$shared/models/activity'
	import type { User } from '$shared/models/user'
	import { usersMapBucket, projectsMapBucket } from '$lib/utils/localstorage'
	import { sendActivityRevert, sendActivityApply } from '$lib/utils/messaging'
	import { jsToCssProperty } from '$shared/helpers'

	import { CodeBlock, storeHighlightJs } from '@skeletonlabs/skeleton'
	import hljs from 'highlight.js/lib/core'
	import css from 'highlight.js/lib/languages/css'
	import 'highlight.js/styles/github.css'

	import ItemHeader from './ItemHeader.svelte'
	import ClockArrow from '~icons/mdi/clock-arrow'
	import Trash from '~icons/material-symbols/delete'
	import { postProjectToFirebase } from '$lib/storage/project'

	export let project: Project

	const modalId = 'delete-activity-modal'
	let activities: Activity[] = []
	let usersMap: Map<string, User> = new Map()

	onMount(async () => {
		usersMap = new Map(Object.entries(await usersMapBucket.get()))
		storeHighlightJs.set(hljs)
		hljs.registerLanguage('css', css)
	})

	$: activities = Object.values(project.activities).sort(
		(a, b) =>
			new Date(b.creationTime ?? b.createdAt).getTime() -
			new Date(a.creationTime ?? a.createdAt).getTime()
	)

	let deleteActivity = (activity: Activity) => {
		project.activities = Object.fromEntries(
			Object.entries(project.activities).filter(([key]) => key !== activity.selector)
		)

		sendActivityRevert(activity)
		postProjectToFirebase(project)
		projectsMapBucket.set({ [project.id]: project })
		project = { ...project }
		closeModal()
	}

	let clickActivity = (activity: Activity) => {
		// sendActivityInspect({
		// 	selector: activity.selector,
		// 	event: MouseEvent.CLICK,
		// 	scrollToElement: true
		// })
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

	function formatStyleChanges(styleChanges: Record<string, StyleChange>): string {
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
<div class="divide-y flex flex-col w-full">
	{#each activities as activity}
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
				createdAt={activity.creationTime ?? activity.createdAt}
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

			<div class="flex flex-col space-y-3 w-full">
				<p>Selector:</p>
				<span class="text-orange-600 bg-gray-50 p-2 rounded border">{activity.selector}</span>

				{#if activity.path}
					<p>Path:</p>
					<span class="text-orange-600 bg-gray-50 p-2 rounded border">{activity.path}</span>
				{/if}

				<p>Code Change:</p>
				<CodeBlock
					class="text-xs bg-gray-50 rounded p-1 border w-[23rem] text-start overflow-auto "
					language="css"
					code={formatStyleChanges(activity.styleChanges)}
					color="text-gray-800"
					text="text-xs"
					button="btn btn-xs ml-auto rounded-sm"
				/>

				{#if activity.previewImage}
					<p>Preview image:</p>
					<img src={activity.previewImage} alt="Preview" class="w-full rounded border" />
				{/if}
			</div>
		</div>
	{/each}
</div>
