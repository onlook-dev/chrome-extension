<script lang="ts">
	import ItemHeader from './ItemHeader.svelte';
	import { jsToCssProperty } from '$shared/helpers';
	import { projectsMapStore, usersMapStore } from '$lib/utils/store';

	import type { Activity } from '$shared/models/activity';
	import type { Project } from '$shared/models/project';
	import { GithubLogo, Trash } from 'svelte-radix';
	import { FirebaseService } from '$lib/storage';
	import { FirestoreCollections } from '$shared/constants';

	export let activity: Activity;
	export let project: Project;

	const projectService = new FirebaseService<Project>(FirestoreCollections.PROJECTS);
	$: userName = $usersMapStore.get(activity.userId)?.name;

	async function deleteActivity(activity: Activity, modalId: string) {
		project.activities = Object.fromEntries(
			Object.entries(project.activities).filter(([key, value]) => value.id !== activity.id)
		);

		await projectService.post(project, false);

		projectsMapStore.update((projectsMap) => {
			projectsMap.set(project.id, project);
			return projectsMap;
		});
		project = { ...project };
	}
</script>

<div class="flex flex-col space-y-3 w-full p-4">
	<ItemHeader
		profileImageUrl={$usersMapStore.get(activity.userId)?.profileImage}
		createdAt={activity.updatedAt ?? activity.createdAt}
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
								project?.githubSettings?.rootPath ? `${project?.githubSettings?.rootPath}/` : ''
							}${activity?.path?.split(':')[0]}#L${activity?.path?.split(':')[1]}`,
							'_blank'
						)}
				>
					<GithubLogo class="w-4 h-4" />
				</button>
			</div>
		{/if}
		<div class="tooltip tooltip-left" data-tip="Delete activity">
			<button class="btn btn-sm btn-square btn-ghost">
				<Trash />
			</button>
			<dialog id={activity.id} class="modal">
				<div class="modal-box">
					<h3 class="font-bold text-lg">Delete activity?</h3>
					<p class="py-4">Deleted activities can NOT be restored. Continue?</p>
					<div class="modal-action space-x-2">
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

	<p>
		Selector
		<span class="text-brand">{activity.selector}</span>
	</p>
	{#if activity.path}
		<p>
			Path
			<span class="text-brand">{activity.path}</span>
		</p>
	{/if}

	{#each Object.values(activity.styleChanges) as styleChange}
		<p>
			{userName}
			{#if styleChange.oldVal === ''}
				added style
				<span class="text-brand">{jsToCssProperty(styleChange.key)}</span>
				with value
			{:else}
				update style of
				<span class="text-brand">{jsToCssProperty(styleChange.key)}</span>
				from
				<span class="text-brand">{styleChange.oldVal}</span>
				to
			{/if}
			<span class="text-brand">{styleChange.newVal}</span>
		</p>
	{/each}

	{#if activity.textChanges && Object.keys(activity.textChanges).length > 0}
		<p>
			{userName}
			updated
			<span class="text-brand">text</span>
			from
			<span class="text-brand">{activity.textChanges.text.oldVal}</span>
			to
			<span class="text-brand">{activity.textChanges.text.newVal}</span>
		</p>
	{/if}

	{#if activity.attributeChanges && Object.keys(activity.attributeChanges).length > 0}
		<p>
			{userName}
			{#if activity.attributeChanges.full.oldVal === ''}
				added class value
				<span class="text-brand">{activity.attributeChanges.full.newVal}</span>
			{:else}
				updated
				<span class="text-brand">class</span>
				from
				<span class="text-brand"> {activity.attributeChanges.full.oldVal}</span>
				to
				<span class="text-brand"> {activity.attributeChanges.full.newVal}</span>
				. New attributes:
				<span class="text-brand"> {activity.attributeChanges.updated.newVal}</span>
			{/if}
		</p>
	{/if}
</div>
