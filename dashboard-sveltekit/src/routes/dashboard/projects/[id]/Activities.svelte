<script lang="ts">
	import type { Project } from '$shared/models/project';
	import type { Activity } from '$shared/models/activity';
	import {
		EventMetadataType,
		getEventDataByType,
		type EventMetadata
	} from '$shared/models/eventData';
	import ItemHeader from './ItemHeader.svelte';
	import { usersMapStore } from '$lib/utils/store';

	export let project: Project;
	let activities: Activity[];

	let hoverActivity = (activity: Activity) => {};
	let leaveActivity = (activity: Activity) => {};
	let clickActivity = (activity: Activity) => {};

	$: activities = project.activities.sort(
		(a, b) => a.creationTime.getTime() - b.creationTime.getTime()
	);
</script>

{#if activities.length === 0}
	<div class="flex flex-col items-center justify-center h-full">
		<p class="text-gray-500">No activities yet</p>
	</div>
{/if}
<div class="divide-y flex flex-col w-full">
	<h1 class="m-2 font-semibold">Acitivities</h1>
	{#each activities as activity}
		<!-- TODO: Add helper -->
		{#if activity.styleChanges.length > 0}
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
					profileImageUrl={$usersMapStore.get(activity.userId)?.profileImage}
					userName={$usersMapStore.get(activity.userId)?.name}
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
					{#each Object.entries(activity.styleChanges) as [key, value]}
						<div class="">{key}: {value};</div>
					{/each}
				</div>
			</button>
		{/if}
	{/each}
</div>
