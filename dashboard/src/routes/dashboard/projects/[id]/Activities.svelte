<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import type { Project } from '$shared/models/project';
	import type { Activity } from '$shared/models/activity';
	import { projectsMapStore, usersMapStore } from '$lib/utils/store';
	import { formatAttrChanges, formatStyleChanges, jsToCssProperty } from '$shared/helpers';
	import GitHub from '~icons/mdi/github';
	import ItemHeader from './ItemHeader.svelte';
	import Trash from '~icons/material-symbols/delete';
	import { DashboardRoutes, DashboardSearchParams, FirestoreCollections } from '$shared/constants';

	import { CodeBlock, storeHighlightJs } from '@skeletonlabs/skeleton';
	import hljs from 'highlight.js/lib/core';
	import css from 'highlight.js/lib/languages/css';
	import html from 'highlight.js/lib/languages/xml';
	import javascript from 'highlight.js/lib/languages/javascript';
	import shell from 'highlight.js/lib/languages/shell';
	import 'highlight.js/styles/github.css';
	import { goto } from '$app/navigation';
	import { FirebaseService } from '$lib/storage';

	export let project: Project;
	export let activeActivityId: string;

	let activities: Activity[];
	const projectService = new FirebaseService<Project>(FirestoreCollections.PROJECTS);

	onMount(() => {
		// Get active activity from params
		activeActivityId = $page.url.searchParams.get(DashboardSearchParams.ACTIVITY) ?? '';

		storeHighlightJs.set(hljs);
		hljs.registerLanguage('css', css);
		hljs.registerLanguage('javascript', javascript);
		hljs.registerLanguage('shell', shell);
		hljs.registerLanguage('html', html);
	});

	$: activities = Object.values(project.activities).sort(
		(a, b) =>
			new Date(b.updatedAt ?? b.createdAt).getTime() -
			new Date(a.updatedAt ?? a.createdAt).getTime()
	);

	function showModal(modalId: string) {
		const modal = document.getElementById(modalId) as HTMLDialogElement;
		if (modal) {
			modal.showModal();
			modal.addEventListener(
				'click',
				(event) => {
					if (event.target === modal) {
						closeModal(modalId);
					}
				},
				{ once: true }
			);
		}
	}

	function closeModal(modalId: string) {
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
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<div
			class="w-full p-4 flex flex-col pb-6 transition duration-200 ease-in-out {activeActivityId ==
			activity.id
				? 'bg-red-200 shadow-lg'
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
				createdAt={activity.updatedAt ?? activity.createdAt}
			></ItemHeader>
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
						class="bg-gray-50 rounded p-1 border w-full text-start flex flex-col overflow-auto "
						language="css"
						code={formatStyleChanges(activity.styleChanges)}
						color="text-gray-800"
						text="text-sm"
					/>
				{/if}

				{#if activity.textChanges && Object.keys(activity.textChanges).length > 0}
					<p>Text Change:</p>
					<textarea
						disabled
						class="bg-gray-50 rounded p-4 border w-full text-start flex flex-col overflow-auto text-gray-800 text-sm"
						value={activity.textChanges.text?.newVal ?? ''}
					/>
				{/if}

				{#if activity.attributeChanges && Object.keys(activity.attributeChanges).length > 0}
					<p>Class Change:</p>
					<textarea
						disabled
						class="bg-gray-50 rounded p-4 border w-full text-start flex flex-col overflow-auto text-gray-800 text-sm"
						value={formatAttrChanges(activity.attributeChanges)}
					/>
				{/if}

				{#if activity.beforeImage}
					<p>Before image:</p>
					<img src={activity.beforeImage} alt="Before" class="w-full rounded border" />
				{/if}

				{#if activity.previewImage}
					<p>Preview image:</p>
					<img src={activity.previewImage} alt="Preview" class="w-full rounded border" />
				{/if}
			</div>
		</div>
	{/each}
</div>
