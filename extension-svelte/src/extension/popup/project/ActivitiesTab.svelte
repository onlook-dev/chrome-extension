<script lang="ts">
	import { onMount } from 'svelte'
	import type { Project } from '$shared/models/project'
	import type { Activity, StyleChange } from '$shared/models/activity'
	import type { User } from '$shared/models/user'
	import { EventMetadataType, getEventDataByType } from '$shared/models/eventData'
	import ItemHeader from './ItemHeader.svelte'
	import { usersMapBucket, changeMapBucket } from '$lib/utils/localstorage'

	export let project: Project

	let activities: Activity[] = []
	let usersMap: Map<string, User> = new Map()

	let hoverActivity = (activity: Activity) => {}
	let leaveActivity = (activity: Activity) => {}
	let clickActivity = (activity: Activity) => {}

	onMount(async () => {
		usersMap = new Map(Object.entries(await usersMapBucket.get()))
		getTestChanges()
	})

	// $: activities = project.activities.sort(
	// 	(a, b) => new Date(a.creationTime).getTime() - new Date(b.creationTime).getTime()
	// )

	function getTestChanges() {
		changeMapBucket.valueStream.subscribe((changes: any) => {
			Object.keys(changes).forEach((selector: string) => {
				const styleChanges = []

				for (const [key, value] of Object.entries(changes[selector])) {
					// TODO: Make valid css key
					const styleChange = {
						key: key,
						oldVal: '',
						newVal: value
					} as StyleChange
					styleChanges.push(styleChange)
				}

				const activity = {
					id: '0',
					userId: 'S1Waz3ec25Zo2RykTFXSOOoJ4nx2',
					projectId: project.id,
					eventData: [],
					creationTime: new Date(),
					selector: selector,
					styleChanges: styleChanges,
					visible: true
				} as Activity
				activities = [...activities, activity]
			})
		})
	}
</script>

{#if activities.length === 0}
	<div class="flex flex-col items-center justify-center h-full">
		<p class="text-gray-500">No activities yet</p>
	</div>
{/if}
<div class="divide-y flex flex-col w-full">
	{#each activities as activity}
		<!-- TODO: Add helper -->
		<button
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
			/>

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
			<div class="bg-gray-50 rounded p-4 border w-full text-start">
				{#each activity.styleChanges as styleChange}
					<div class="">{styleChange.key}: {styleChange.newVal};</div>
				{/each}
			</div>
		</button>
	{/each}
</div>
