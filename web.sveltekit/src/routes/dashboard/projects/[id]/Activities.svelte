<script lang="ts">
	import type { ChangeSetImpl } from '$lib/models/changeset';
	import { timeSince } from '$lib/models/comment';
	import { EventMetadataType } from '$lib/models/metadata';
	import ItemHeader from './ItemHeader.svelte';

	export let changeSets: ChangeSetImpl[] = [];
	let hoverChangeSet: (changeSet: ChangeSetImpl) => void;
	let leaveChangeSet: (changeSet: ChangeSetImpl) => void;
	let clickChangeSet: (changeSet: ChangeSetImpl) => void;
</script>

{#if changeSets.length === 0}
	<div class="flex flex-col items-center justify-center h-full">
		<p class="text-gray-500">No activities yet</p>
	</div>
{/if}
{#each changeSets as changeSet}
	{#if !changeSet.isStyleEmpty()}
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<button
			class="w-full p-4 flex flex-col pb-6 hover:bg-gray-50 transition duration-200 ease-in-out {!changeSet.visible
				? 'opacity-60'
				: ''}
					"
			on:mouseenter={() => hoverChangeSet(changeSet)}
			on:mouseleave={() => leaveChangeSet(changeSet)}
			on:click={() => clickChangeSet(changeSet)}
		>
			<!-- Item header -->
			<ItemHeader
				profileImageUrl={changeSet.author.profileImage}
				userName={changeSet.author.name}
				creationTime={new Date(changeSet.metadata[0]?.value)}
			/>

			<!-- Item body -->
			<div class="mb-2 w-full text-start">
				Element:
				<span class="text-orange-600 bg-gray-100 p-0.5 rounded border">{changeSet.selector}</span>
			</div>

			{#if changeSet.getMetadataByType(EventMetadataType.SOURCE_MAP_ID)?.value}
				<div class="mb-2 w-full text-start">
					Source:
					<a
						on:click={() => {}}
						class="text-orange-600 bg-gray-100 p-0.5 rounded border hover:underline"
						>{changeSet.getMetadataByType(EventMetadataType.SOURCE_MAP_ID)?.value}</a
					>
				</div>
			{/if}
			<div class="bg-gray-50 rounded p-4 border w-full text-start">
				{#each Object.entries(changeSet.stylesObj) as [key, value]}
					<div class="">{key}: {value};</div>
				{/each}
			</div>
		</button>
	{/if}
{/each}
