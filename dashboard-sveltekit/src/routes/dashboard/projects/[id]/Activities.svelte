<script lang="ts">
	import type { Project } from '$shared/models/project';
	import type { Activity } from '$shared/models/activity';
	import { EventMetadataType, getEventDataByType } from '$shared/models/eventData';
	import { projectsMapStore, usersMapStore } from '$lib/utils/store';
	import { jsToCssProperty } from '$shared/helpers';
	import { postProjectToFirebase } from '$lib/storage/project';
	import GitHub from '~icons/mdi/github';

	import ItemHeader from './ItemHeader.svelte';
	import Trash from '~icons/material-symbols/delete';

	export let project: Project;

	const modalId = 'delete-activity-modal';
	let activities: Activity[];

	$: activities = Object.values(project.activities).sort(
		(a, b) =>
			new Date(b.creationTime ?? b.createdAt).getTime() -
			new Date(a.creationTime ?? a.createdAt).getTime()
	);

	let deleteActivity = (activity: Activity) => {
		project.activities = Object.fromEntries(
			Object.entries(project.activities).filter(([key, value]) => key !== activity.selector)
		);

		postProjectToFirebase(project);
		projectsMapStore.update((projectsMap) => {
			projectsMap.set(project.id, project);
			return projectsMap;
		});
		project = { ...project };
		closeModal();
	};

	function showModal() {
		const modal = document.getElementById(modalId) as HTMLDialogElement;
		if (modal) {
			modal.showModal();
			modal.addEventListener(
				'click',
				(event) => {
					if (event.target === modal) {
						closeModal();
					}
				},
				{ once: true }
			);
		}
	}

	function closeModal() {
		const modal = document.getElementById(modalId) as HTMLDialogElement;
		if (modal) {
			modal.close();
		}
	}
</script>

{#if activities.length === 0}
	<div class="flex flex-col items-center justify-center h-full">
		<p class="text-gray-500">No activities yet</p>
	</div>
{/if}
<div class="divide-y flex flex-col w-full">
	<h1 class="m-2 font-semibold">Activities</h1>
	{#each activities as activity}
		<!-- TODO: Add helper -->
		{#if Object.keys(activity.styleChanges).length > 0}
			<button
				class="w-full p-4 flex flex-col pb-6 hover:bg-gray-50 transition duration-200 ease-in-out {!activity.visible
					? 'opacity-60'
					: ''}
					"
			>
				<!-- Item header -->
				<ItemHeader
					profileImageUrl={$usersMapStore.get(activity.userId)?.profileImage}
					userName={$usersMapStore.get(activity.userId)?.name}
					createdAt={activity.creationTime ?? activity.createdAt}
				>
					{#if activity.path}
						<div class="tooltip tooltip-left" data-tip="View in GitHub">
							<button
								class="btn btn-xs btn-square btn-ghost ml-auto"
								on:click={() =>
									window.open(
										`https://github.com/${project?.githubSettings?.owner}/${
											project?.githubSettings?.repositoryName
										}/blob/${project?.githubSettings?.baseBranch}/${
											activity?.path?.split(':')[0]
										}#L${activity?.path?.split(':')[1]}`,
										'_blank'
									)}
							>
								<GitHub class="w-4 h-4" />
							</button>
						</div>
					{/if}
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
				<div class="mb-2 w-full text-start flex flex-col">
					Element:
					<span class="text-orange-600 bg-gray-100 p-0.5 rounded border">{activity.selector}</span>
					{#if activity.path}
						Path: <span class="text-orange-600 bg-gray-100 p-0.5 rounded border"
							>{activity.path}</span
						>
					{/if}
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
			</button>
		{/if}
	{/each}
</div>
