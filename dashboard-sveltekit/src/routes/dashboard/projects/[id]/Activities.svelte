<script lang="ts">
	import type { Activity } from '$models/activity';
	import { timeSince } from '$models/comment';
	import { EventMetadataType } from '$models/eventData';
	import ItemHeader from './ItemHeader.svelte';

	export let activities: Activity[] = [];
	let hoverChangeSet: (changeSet: Activity) => void;
	let leaveChangeSet: (changeSet: Activity) => void;
	let clickChangeSet: (changeSet: Activity) => void;
</script>

{#if activities.length === 0}
	<div class="flex flex-col items-center justify-center h-full">
		<p class="text-gray-500">No activities yet</p>
	</div>
{/if}
{#each activities as activity}
	<!-- TODO: Add helper -->
	{#if !activity.isStyleEmpty()}
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<button
			class="w-full p-4 flex flex-col pb-6 hover:bg-gray-50 transition duration-200 ease-in-out {!activity.visible
				? 'opacity-60'
				: ''}
					"
			on:mouseenter={() => hoverChangeSet(activity)}
			on:mouseleave={() => leaveChangeSet(activity)}
			on:click={() => clickChangeSet(activity)}
		>
			<!-- Item header -->
			<!-- TODO: Get user from map -->
			<ItemHeader
				profileImageUrl={activity.userId}
				userName={activity.userId}
				creationTime={new Date(activity.metadata[0]?.value)}
			/>

			<!-- Item body -->
			<div class="mb-2 w-full text-start">
				Element:
				<span class="text-orange-600 bg-gray-100 p-0.5 rounded border">{activity.selector}</span>
			</div>

			{#if activity.getMetadataByType(EventMetadataType.SOURCE_MAP_ID)?.value}
				<div class="mb-2 w-full text-start">
					Source:
					<a
						on:click={() => {}}
						class="text-orange-600 bg-gray-100 p-0.5 rounded border hover:underline"
						>{activity.getMetadataByType(EventMetadataType.SOURCE_MAP_ID)?.value}</a
					>
				</div>
			{/if}
			<div class="bg-gray-50 rounded p-4 border w-full text-start">
				{#each Object.entries(activity.stylesObj) as [key, value]}
					<div class="">{key}: {value};</div>
				{/each}
			</div>
		</button>
	{/if}
{/each}
