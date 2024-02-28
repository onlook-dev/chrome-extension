<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import type { Project } from '$shared/models/project';
	import type { Activity, StyleChange } from '$shared/models/activity';
	import { projectsMapStore, usersMapStore } from '$lib/utils/store';
	import { jsToCssProperty } from '$shared/helpers';
	import { postProjectToFirebase } from '$lib/storage/project';
	import GitHub from '~icons/mdi/github';
	import ItemHeader from './ItemHeader.svelte';
	import Trash from '~icons/material-symbols/delete';
	import { DashboardRoutes, DashboardSearchParams } from '$shared/constants';

	import { CodeBlock, storeHighlightJs } from '@skeletonlabs/skeleton';
	import hljs from 'highlight.js/lib/core';
	import css from 'highlight.js/lib/languages/css';
	import javascript from 'highlight.js/lib/languages/javascript';
	import shell from 'highlight.js/lib/languages/shell';
	import 'highlight.js/styles/github.css';
	import { goto } from '$app/navigation';

	export let project: Project;
	export let activeActivityId: string;

	const modalId = 'delete-activity-modal';
	let activities: Activity[];

	onMount(() => {
		// Get active activity from params
		activeActivityId = $page.url.searchParams.get(DashboardSearchParams.ACTIVITY) ?? '';

		storeHighlightJs.set(hljs);
		hljs.registerLanguage('css', css);
		hljs.registerLanguage('javascript', javascript);
		hljs.registerLanguage('shell', shell);
	});

	$: activities = Object.values(project.activities).sort(
		(a, b) =>
			new Date(b.creationTime ?? b.createdAt).getTime() -
			new Date(a.creationTime ?? a.createdAt).getTime()
	);

	function deleteActivity(activity: Activity) {
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
	}

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

	// Format style changes for an activity
	function formatStyleChanges(styleChanges: Record<string, StyleChange>): string {
		return Object.values(styleChanges)
			.map(({ key, newVal }) => `${jsToCssProperty(key)}: ${newVal};`)
			.join('\n');
	}
</script>

{#if activities.length === 0}
	<div class="flex flex-col items-center justify-center h-full">
		<p class="text-gray-500">No activities yet</p>
	</div>
{/if}
<div class="divide-y flex flex-col w-full">
	<h1 class="text-red-600 font-light">Activities</h1>
	{#each activities as activity}
		<!-- TODO: Add helper -->
		{#if Object.keys(activity.styleChanges).length > 0}
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<!-- svelte-ignore a11y-no-static-element-interactions -->
			<div
				class="w-full p-4 flex flex-col pb-6 transition duration-200 ease-in-out {activeActivityId ==
				activity.id
					? 'bg-sky-100 shadow-lg'
					: ''}
					"
				on:click={() => {
					if (activeActivityId === activity.id) {
						activeActivityId = '';
						goto(`${DashboardRoutes.PROJECTS}/${project.id}`, {
							replaceState: true
						});
					} else {
						activeActivityId = activity.id;
						goto(
							`${DashboardRoutes.PROJECTS}/${project.id}?${DashboardSearchParams.ACTIVITY}=` +
								activity.id,
							{
								replaceState: true
							}
						);
					}
				}}
			>
				<!-- Item header -->
				<ItemHeader
					profileImageUrl={$usersMapStore.get(activity.userId)?.profileImage}
					userName={$usersMapStore.get(activity.userId)?.name}
					createdAt={activity.creationTime ?? activity.createdAt}
				>
					{#if project?.githubSettings && activity?.path}
						<div class="tooltip tooltip-left" data-tip="View in GitHub">
							<button
								class="btn btn-xs btn-square btn-ghost ml-auto"
								on:click={() =>
									// Root path may be empty
									window.open(
										`https://github.com/${project?.githubSettings?.owner}/${
											project?.githubSettings?.repositoryName
										}/blob/${project?.githubSettings?.baseBranch}/${
											project?.githubSettings?.rootPath
												? `${project?.githubSettings?.rootPath}/`
												: ''
										}${activity?.path?.split(':')[0]}#L${activity?.path?.split(':')[1]}`,
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

				<div class="flex flex-col space-y-3 w-full">
					<p>Selector:</p>
					<span class="text-orange-600 bg-gray-50 p-2 rounded border">{activity.selector}</span>

					{#if activity.path}
						<p>Path:</p>
						<span class="text-orange-600 bg-gray-50 p-2 rounded border">{activity.path}</span>
					{/if}

					<p>Code Change:</p>
					<CodeBlock
						class="bg-gray-50 rounded p-1 border w-full text-start flex flex-col overflow-auto "
						language="css"
						code={formatStyleChanges(activity.styleChanges)}
						color="text-gray-800"
						text="text-sm"
					/>

					{#if activity.previewImage}
						<p>Preview image:</p>
						<img src={activity.previewImage} alt="Preview" class="w-full rounded border" />
					{/if}
				</div>
			</div>
		{/if}
	{/each}
</div>
